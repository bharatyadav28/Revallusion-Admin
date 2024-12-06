import React from "react";

import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface Props {
  maxChars?: number;
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
}

export const CustomTextArea = ({
  maxChars,
  text,
  setText,
  className,
}: Props) => {
  const classes = `resize-none border-gray-400  ${className}`;

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (maxChars && event.target.value.length > maxChars) {
      return;
    }
    setText(event.target.value);
  };

  return (
    <>
      <Textarea
        id="message"
        placeholder="Type your caption here..."
        value={text}
        onChange={handleChange}
        className={classes}
      />
      <p
        className={`text-sm ms-1 ${
          text.length === maxChars ? "text-red-500" : "text-gray-500"
        }`}
      >
        {maxChars && maxChars - text.length + " characters remaining"}
      </p>
    </>
  );
};

export const CustomInput = ({ maxChars, text, setText, className }: Props) => {
  const classes = `resize-none border-gray-400 py-5  ${className}`;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (maxChars && event.target.value.length > maxChars) {
      return;
    }
    setText(event.target.value);
  };

  return (
    <>
      <Input
        id="message"
        placeholder="Type your caption here..."
        value={text}
        onChange={handleChange}
        className={classes}
      />
      <p
        className={`text-sm ms-1 ${
          text.length === maxChars ? "text-red-500" : "text-gray-500"
        }`}
      >
        {maxChars && maxChars - text.length + " characters remaining"}
      </p>
    </>
  );
};

interface BtnProps {
  children: React.ReactNode;
  handleClick: () => void;
  className?: string;
}
export const PurpleButton = ({
  children,
  handleClick,
  className,
}: BtnProps) => {
  const classes = `bg-[var(--lightpurple)] w-max ${className} hover:bg-[var(--softpurple)] text-[#fff] transition`;

  return (
    <Button className={classes} onClick={handleClick}>
      {children}
    </Button>
  );
};
