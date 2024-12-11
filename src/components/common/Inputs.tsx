import React from "react";
import { CiEdit as EditIcon } from "react-icons/ci";
import { MdDelete as DeleteIcon } from "react-icons/md";

import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingSpinner } from "./LoadingSpinner";

// Textarea input
interface Props extends React.InputHTMLAttributes<HTMLTextAreaElement> {
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
  ...props
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
        placeholder="Type your description here..."
        value={text}
        onChange={handleChange}
        className={classes}
        {...props}
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

// Normal input
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  maxChars?: number;
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
}

export const CustomInput = ({
  maxChars,
  text,
  setText,
  className,
  ...props
}: InputProps) => {
  const classes = `resize-none border-gray-400 py-5  ${className}`;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (maxChars && event.target.value?.length > maxChars) {
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
        {...props}
      />
      <p
        className={`text-sm ms-1 ${
          text?.length === maxChars ? "text-red-500" : "text-gray-500"
        }`}
      >
        {maxChars && maxChars - text.length + " characters remaining"}
      </p>
    </>
  );
};

// Custom buttons
interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  handleClick: () => void;
  className?: string;
  isDeleting?: boolean;
}

export const CustomButton = ({
  children,
  handleClick,
  className,
  ...props
}: BtnProps) => {
  const classes = `w-max ${className}  transition`;

  return (
    <Button className={classes} onClick={handleClick} {...props}>
      {children}
    </Button>
  );
};

// Mutation buttons
export const UpdateButton = ({
  handleClick,
  className,
  ...props
}: BtnProps) => {
  return (
    <Button
      variant="outline"
      size="icon"
      className={`green-button ${className}`}
      onClick={handleClick}
      {...props}
    >
      <EditIcon size={20} />
    </Button>
  );
};

export const DeleteButton = ({
  children,
  handleClick,
  className,
  isDeleting,
  ...props
}: BtnProps) => {
  return (
    <Button
      variant="destructive"
      size="icon"
      className="ml-3"
      onClick={handleClick}
      disabled={isDeleting}
      {...props}
    >
      {isDeleting ? <LoadingSpinner /> : <DeleteIcon size={20} />}
    </Button>
  );
};

// Select Input
interface SelectProps {
  menu: string[];
  value: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
}
export const CustomSelect = ({
  menu,
  value,
  onChange,
  className,
  ...props
}: SelectProps) => {
  const classes = `py-5 border-gray-400 ${className}`;

  return (
    <>
      <Select onValueChange={onChange} value={value} {...props}>
        <SelectTrigger className={classes}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {menu?.map((item) => {
            return (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </>
  );
};
