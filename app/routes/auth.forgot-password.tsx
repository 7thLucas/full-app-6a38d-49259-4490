import { redirect } from "react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { AuthService } from "~/modules/authentication/authentication.service";
import { ForgotPasswordCard } from "~/modules/authentication";

export async function loader({ request }: LoaderFunctionArgs) {
  if (getUserFromRequest(request)) return redirect("/planner");
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  try {
    await AuthService.forgotPassword(String(formData.get("email") ?? ""));
  } catch {}
  return {
    success: true,
    message: "Jika email terdaftar, link reset telah dikirim. Cek kotak masukmu.",
  };
}

export default function ForgotPasswordRoute() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <ForgotPasswordCard />
    </div>
  );
}
