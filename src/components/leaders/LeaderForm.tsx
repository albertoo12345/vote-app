import { set, z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/(app)/leaders/useOptimisticLeaders";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useBackPath } from "@/components/shared/BackButton";

import { type Leader, insertLeaderParams } from "@/lib/db/schema/leaders";
import { createLeaderAction, deleteLeaderAction, updateLeaderAction } from "@/lib/actions/leaders";
import QRScanner from "../qrScanner";

const LeaderForm = ({
  leader,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  leader?: Leader | null;

  openModal?: (leader?: Leader) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } = useValidatedForm<Leader>(insertLeaderParams);
  const editing = !!leader?.id;

  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();
  const [qrError, setQrError] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [qrMode, setQrMode] = useState(false);
  const router = useRouter();
  const backpath = useBackPath("leaders");

  const onSuccess = (action: Action, data?: { error: string; values: Leader }) => {
    const failed = Boolean(data?.error);
    if (failed) {
      openModal && openModal(data?.values);
      toast.error(`Failed to ${action}`, {
        description: data?.error ?? "Error",
      });
    } else {
      router.refresh();
      postSuccess && postSuccess();
      toast.success(`Leader ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const leaderParsed = await insertLeaderParams.safeParseAsync({ ...payload });
    if (!leaderParsed.success) {
      setErrors(leaderParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = leaderParsed.data;
    const pendingLeader: Leader = {
      updatedAt: leader?.updatedAt ?? new Date(),
      createdAt: leader?.createdAt ?? new Date(),
      id: leader?.id ?? "",
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic &&
          addOptimistic({
            data: pendingLeader,
            action: editing ? "update" : "create",
          });

        const error = editing ? await updateLeaderAction({ ...values, id: leader.id }) : await createLeaderAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingLeader,
        };
        onSuccess(editing ? "update" : "create", error ? errorFormatted : undefined);
      });
    } catch (e) {
      if (e instanceof z.ZodError) {
        setErrors(e.flatten().fieldErrors);
      }
    }
  };

  const handleQRScan = (text: string) => {
    const splittedText = text.split("|");
    if (splittedText.length !== 17) {
      setQrError("Hubo un error al escanear tu cédula, intenta manualmente");
      return;
    }
    const newNationalId = splittedText[0];
    const newName = splittedText[1];
    const newLastName = splittedText[2];

    // Set values after 1 second to avoid flickering
    setQrMode(false);
    setNationalId(newNationalId);
    setName(newName);
    setLastName(newLastName);

    return;
  };
  return (
    <form action={handleSubmit} onChange={handleChange} className={"space-y-8"}>
      <Button type="button" variant={"outline"} onClick={() => setQrMode(true)}>
        Rellena con QR
      </Button>
      {qrMode && <QRScanner components={{ tracker: qrMode }} onResult={handleQRScan} />}
      {/* Schema fields start */}
      <div>
        <Label className={cn("mb-2 inline-block", errors?.name ? "text-destructive" : "")}>Name</Label>
        <Input
          type="text"
          id="name"
          name="name"
          className={cn(errors?.name ? "ring ring-destructive" : "")}
          defaultValue={leader?.name || name || ""}
        />
        {errors?.name ? <p className="text-xs text-destructive mt-2">{errors.name[0]}</p> : <div className="h-6" />}
      </div>
      <div>
        <Label className={cn("mb-2 inline-block", errors?.lastName ? "text-destructive" : "")}>Last Name</Label>
        <Input
          type="text"
          id="lastName"
          name="lastName"
          className={cn(errors?.lastName ? "ring ring-destructive" : "")}
          defaultValue={leader?.lastName || lastName || ""}
        />
        {errors?.lastName ? <p className="text-xs text-destructive mt-2">{errors.lastName[0]}</p> : <div className="h-6" />}
      </div>
      <div>
        <Label className={cn("mb-2 inline-block", errors?.nationalId ? "text-destructive" : "")}>National Id</Label>
        <Input
          type="text"
          id="nationalId"
          name="nationalId"
          className={cn(errors?.nationalId ? "ring ring-destructive" : "")}
          defaultValue={leader?.nationalId || nationalId || ""}
        />
        {errors?.nationalId ? <p className="text-xs text-destructive mt-2">{errors.nationalId[0]}</p> : <div className="h-6" />}
      </div>
      <div>
        <Label className={cn("mb-2 inline-block", errors?.email ? "text-destructive" : "")}>Email</Label>
        <Input type="text" name="email" className={cn(errors?.email ? "ring ring-destructive" : "")} defaultValue={leader?.email ?? ""} />
        {errors?.email ? <p className="text-xs text-destructive mt-2">{errors.email[0]}</p> : <div className="h-6" />}
      </div>
      {/* Schema fields end */}

      {/* Save Button */}
      <SaveButton errors={hasErrors} editing={editing} />

      {/* Delete Button */}
      {editing ? (
        <Button
          type="button"
          disabled={isDeleting || pending || hasErrors}
          variant={"destructive"}
          onClick={() => {
            setIsDeleting(true);
            closeModal && closeModal();
            startMutation(async () => {
              addOptimistic && addOptimistic({ action: "delete", data: leader });
              const error = await deleteLeaderAction(leader.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: leader,
              };

              onSuccess("delete", error ? errorFormatted : undefined);
            });
          }}
        >
          Delet{isDeleting ? "ing..." : "e"}
        </Button>
      ) : null}
    </form>
  );
};

export default LeaderForm;

const SaveButton = ({ editing, errors }: { editing: Boolean; errors: boolean }) => {
  const { pending } = useFormStatus();
  const isCreating = pending && editing === false;
  const isUpdating = pending && editing === true;
  return (
    <Button type="submit" className="mr-2" disabled={isCreating || isUpdating || errors} aria-disabled={isCreating || isUpdating || errors}>
      {editing ? `Sav${isUpdating ? "ing..." : "e"}` : `Creat${isCreating ? "ing..." : "e"}`}
    </Button>
  );
};
