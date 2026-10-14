import { useState } from "react";
import { brand } from "@/data/brand";

type Props = { propertyName?: string };

const InquiryForm = ({ propertyName }: Props) => {
  const [notice, setNotice] = useState("");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    if (!brand.inquiryEndpoint) {
      setNotice("Your details have not been sent. Configure an inquiry endpoint in src/data/brand.ts to receive submissions.");
      return;
    }

    const response = await fetch(brand.inquiryEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(form))),
    });
    if (!response.ok) throw new Error(`Inquiry submission failed (${response.status}).`);
    setNotice("Thank you. Your inquiry was sent.");
    form.reset();
  };

  return (
    <form className="inquiry-form" onSubmit={(event) => void onSubmit(event)}>
      <label>
        Your name
        <input name="name" autoComplete="name" required minLength={2} />
      </label>
      <label>
        Email address
        <input name="email" type="email" autoComplete="email" required />
      </label>
      <label>
        Phone number <span className="optional-label">Optional</span>
        <input name="phone" type="tel" autoComplete="tel" />
      </label>
      <label>
        How can we help?
        <textarea name="message" rows={4} defaultValue={propertyName ? `I would like more information about ${propertyName}.` : ""} required minLength={10} />
      </label>
      <button className="button button-dark" type="submit">Send enquiry <span aria-hidden="true">↗</span></button>
      {notice && <p className="form-notice" role="status">{notice}</p>}
      <input type="hidden" name="property" value={propertyName ?? ""} />
    </form>
  );
};

export default InquiryForm;
