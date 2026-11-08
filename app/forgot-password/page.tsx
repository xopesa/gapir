import Link from "next/link";
import { Brand } from "@/src/components/layout/brand";
import { getDictionary } from "@/src/i18n/config";

export default function ForgotPasswordPage() {
  const dictionary = getDictionary("ru");
  return <main className="standalone-page"><div className="standalone-card"><Brand /><p className="eyebrow">Gapir Account</p><h1>{dictionary.auth.forgotTitle}</h1><p>{dictionary.auth.forgotText}</p><Link className="button button-primary" href="/login">{dictionary.common.back}</Link></div></main>;
}
