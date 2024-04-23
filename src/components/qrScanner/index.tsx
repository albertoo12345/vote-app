import { Scanner, IScannerProps } from "@yudiel/react-qr-scanner";
export default function QRScanner(props: IScannerProps) {
  return <Scanner {...props} />;
}
