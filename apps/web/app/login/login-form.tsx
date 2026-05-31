"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { magicLinkSchema, type MagicLinkInput } from "@/lib/validation/auth";
import { sendMagicLink } from "./actions";

export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const [pending, startTransition] = useTransition();
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MagicLinkInput>({ resolver: zodResolver(magicLinkSchema) });

  function onSubmit(data: MagicLinkInput) {
    setServerError(null);
    startTransition(async () => {
      const res = await sendMagicLink(data.email, redirectTo);
      if (res.status === "sent") setSentTo(res.email);
      else setServerError(res.message);
    });
  }

  if (sentTo) {
    return (
      <div className="rounded-lg border border-hairline bg-callout p-6 text-callout-foreground">
        <p className="eyebrow !text-callout-foreground/80">Check your email</p>
        <p className="mt-2 leading-relaxed">
          We sent a sign-in link to <strong>{sentTo}</strong>. Open it on this device to
          continue.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block font-[family-name:var(--font-label)] text-sm font-semibold uppercase tracking-[0.12em] text-foreground"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          aria-invalid={errors.email ? "true" : "false"}
          aria-describedby={errors.email ? "email-error" : undefined}
          {...register("email")}
          className="tap-target w-full rounded-md border border-hairline bg-background px-4 text-lg text-foreground outline-none focus:border-brand focus:ring-2 focus:ring-brand"
          placeholder="you@example.com"
        />
        {errors.email ? (
          <p id="email-error" className="text-sm text-accent">
            {errors.email.message}
          </p>
        ) : null}
        {serverError ? (
          <p role="alert" className="text-sm text-accent">
            {serverError}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="tap-target w-full rounded-md bg-brand px-6 font-[family-name:var(--font-label)] font-semibold text-on-brand disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send magic link"}
      </button>
    </form>
  );
}
