"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { Input, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const CAR_MODELS = [
  { value: "volkswagen-up", label: "Volkswagen Up" },
  { value: "seat-mii", label: "Seat Mii" },
  { value: "skoda-citigo", label: "Skoda Citigo" },
];

function ContactFormFields() {
  const tc = useTranslations("contact");
  const tCommon = useTranslations("common");

  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    // Placeholder: simulate form submission
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-xl border border-success/30 bg-success/5 p-8 text-center">
        <svg className="mx-auto h-12 w-12 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="mt-4 text-lg font-medium text-success">
          {tc("sent")}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Input
        label={tc("name")}
        name="name"
        type="text"
        required
        placeholder={tc("name")}
        disabled={status === "sending"}
      />

      <Input
        label={tc("email")}
        name="email"
        type="email"
        required
        placeholder={tc("email")}
        disabled={status === "sending"}
      />

      <Select
        label={tc("carModel")}
        name="carModel"
        placeholder={tc("selectCar")}
        options={CAR_MODELS}
        disabled={status === "sending"}
      />

      <Select
        label={tc("product")}
        name="product"
        placeholder={tc("selectProduct")}
        options={[
          { value: "carplay-screen", label: tc("productScreen") },
          { value: "accessory", label: tc("productAccessory") },
          { value: "other", label: tc("productOther") },
        ]}
        disabled={status === "sending"}
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-text-secondary">{tc("photo")}</label>
        <input
          type="file"
          name="photo"
          accept="image/*"
          disabled={status === "sending"}
          className="w-full rounded-lg bg-card border border-border px-4 py-2.5 text-text-primary file:mr-4 file:rounded-md file:border-0 file:bg-accent file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white file:cursor-pointer hover:file:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-colors duration-200"
        />
      </div>

      <Input
        label={tc("message")}
        name="message"
        multiline
        required
        placeholder={tc("message")}
        disabled={status === "sending"}
      />

      {status === "error" && (
        <p className="text-sm text-accent">{tc("error")}</p>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={status === "sending"}
        className="self-start"
      >
        {status === "sending" ? tCommon("sending") : tc("send")}
      </Button>
    </form>
  );
}

export { ContactFormFields };

export function ContactForm() {
  const t = useTranslations("home");

  return (
    <section className="py-16 sm:py-20">
      <Container className="max-w-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-text-primary sm:text-4xl">
            {t("contactTitle")}
          </h2>
        </div>

        <div className="mt-10">
          <ContactFormFields />
        </div>
      </Container>
    </section>
  );
}
