import { z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/(app)/voters/useOptimisticVoters";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useBackPath } from "@/components/shared/BackButton";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { type Voter, insertVoterParams } from "@/lib/db/schema/voters";
import { createVoterAction, deleteVoterAction, updateVoterAction } from "@/lib/actions/voters";
import { type Leader, type LeaderId } from "@/lib/db/schema/leaders";
import QRScanner from "../qrScanner";

const VoterForm = ({
  leaders,
  leaderId,
  voter,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  voter?: Voter | null;
  leaders: Leader[];
  leaderId?: LeaderId;
  openModal?: (voter?: Voter) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } = useValidatedForm<Voter>(insertVoterParams);
  const editing = !!voter?.id;

  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();
  const [qrError, setQrError] = useState("");
  const [qrMode, setQrMode] = useState(false);
  const [nationalId, setNationalId] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const router = useRouter();
  const backpath = useBackPath("voters");

  const onSuccess = (action: Action, data?: { error: string; values: Voter }) => {
    const failed = Boolean(data?.error);
    if (failed) {
      openModal && openModal(data?.values);
      toast.error(`Failed to ${action}`, {
        description: data?.error ?? "Error",
      });
    } else {
      router.refresh();
      postSuccess && postSuccess();
      toast.success(`Voter ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const voterParsed = await insertVoterParams.safeParseAsync({ leaderId, ...payload });
    if (!voterParsed.success) {
      setErrors(voterParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = voterParsed.data;
    const pendingVoter: Voter = {
      updatedAt: voter?.updatedAt ?? new Date(),
      createdAt: voter?.createdAt ?? new Date(),
      id: voter?.id ?? "",
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic &&
          addOptimistic({
            data: pendingVoter,
            action: editing ? "update" : "create",
          });

        const error = editing ? await updateVoterAction({ ...values, id: voter.id }) : await createVoterAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingVoter,
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
          defaultValue={voter?.name || name || ""}
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
          defaultValue={voter?.lastName || lastName || ""}
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
          defaultValue={voter?.nationalId || nationalId || ""}
        />
        {errors?.nationalId ? <p className="text-xs text-destructive mt-2">{errors.nationalId[0]}</p> : <div className="h-6" />}
      </div>
      <div>
        <Label className={cn("mb-2 inline-block", errors?.school ? "text-destructive" : "")}>School</Label>
        <Input type="text" name="school" className={cn(errors?.school ? "ring ring-destructive" : "")} defaultValue={voter?.school ?? ""} />
        {errors?.school ? <p className="text-xs text-destructive mt-2">{errors.school[0]}</p> : <div className="h-6" />}
      </div>
      <div>
        <Label className={cn("mb-2 inline-block", errors?.township ? "text-destructive" : "")}>Township</Label>
        <Input type="text" name="township" className={cn(errors?.township ? "ring ring-destructive" : "")} defaultValue={voter?.township ?? ""} />
        {errors?.township ? <p className="text-xs text-destructive mt-2">{errors.township[0]}</p> : <div className="h-6" />}
      </div>

      {leaderId ? null : (
        <div>
          <Label className={cn("mb-2 inline-block", errors?.leaderId ? "text-destructive" : "")}>Leader</Label>
          <Select defaultValue={voter?.leaderId} name="leaderId">
            <SelectTrigger className={cn(errors?.leaderId ? "ring ring-destructive" : "")}>
              <SelectValue placeholder="Select a leader" />
            </SelectTrigger>
            <SelectContent>
              {leaders?.map((leader) => (
                <SelectItem key={leader.id} value={leader.id.toString()}>
                  {leader.id}
                  {/* TODO: Replace with a field from the leader model */}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.leaderId ? <p className="text-xs text-destructive mt-2">{errors.leaderId[0]}</p> : <div className="h-6" />}
        </div>
      )}
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
              addOptimistic && addOptimistic({ action: "delete", data: voter });
              const error = await deleteVoterAction(voter.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: voter,
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

export default VoterForm;

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
