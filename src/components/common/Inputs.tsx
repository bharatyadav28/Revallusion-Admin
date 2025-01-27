import React, { useRef } from "react";
import { CiEdit as EditIcon } from "react-icons/ci";
import { MdDelete as DeleteIcon } from "react-icons/md";
import { IoIosArrowUp as ExpandButtonIcon } from "react-icons/io";
import { FaEye } from "react-icons/fa";
import ReactQuill from "react-quill";
import { motion } from "framer-motion";
import { HTMLMotionProps } from "framer-motion";

import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { modules, formats } from "@/lib/resuable-data";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingSpinner } from "./LoadingSpinner";
import { Checkbox } from "../ui/checkbox";

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
      className={`ml-3 ${className}`}
      onClick={handleClick}
      disabled={isDeleting}
      {...props}
    >
      {isDeleting ? <LoadingSpinner /> : <DeleteIcon size={20} />}
    </Button>
  );
};

// View button
export const ViewButton = ({ handleClick, className, ...props }: BtnProps) => {
  return (
    <Button
      variant="outline"
      size="icon"
      className={`bg-[var(--golden)] hover:bg-[var(--dark-golden)] ${className} transition`}
      onClick={handleClick}
      {...props}
    >
      <FaEye size={20} />
    </Button>
  );
};

interface ExpandBtnProps extends HTMLMotionProps<"button"> {
  children?: React.ReactNode;
  handleClick: () => void;
  className?: string;
  isExpanded?: boolean;
}

export const ExpandButton = ({
  handleClick,
  className,
  isExpanded,
  ...props
}: ExpandBtnProps) => {
  // console.log("Is expnaded", isExpanded);
  return (
    <motion.button
      className="bg-[var(--lightpurple)] p-[0.5rem] rounded-sm "
      onClick={handleClick}
      {...props}
      animate={{ rotate: isExpanded ? 180 : 0 }}
    >
      <motion.span
        // animate={{ rotate: isExpanded ? 180 : 0 }}
        className="!p-0 !m-0 flex items-center"
      >
        <ExpandButtonIcon size={17} />
      </motion.span>
    </motion.button>
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

// Select Input with different menu item and its corresponding value
interface SelectProps2 {
  menu: { value: string; key: string }[];
  value: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
}
export const CustomSelectSeperate = ({
  menu,
  value,
  onChange,
  className,
  ...props
}: SelectProps2) => {
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
              <SelectItem key={item.key} value={item.value}>
                {item.key}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </>
  );
};

// Custom Quill Input
interface QuillProps {
  maxChars?: number;
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
}
export const CustomReactQuill = ({ text, setText, maxChars }: QuillProps) => {
  // Ref for accessing Quill editor
  const quillRef = useRef<ReactQuill | null>(null);

  const filteredText = text.replace(/<[^>]*>/g, "");

  const handleTextChange = (value: string) => {
    // Get the Quill editor instance
    const quill = quillRef.current?.getEditor();

    // Remove html tags
    const textOnly = value.replace(/<[^>]*>/g, "");

    if (quill) {
      // Enforce the character limit
      if (maxChars && textOnly.length <= maxChars) {
        setText(value);
      } else {
        const range = quill.getSelection();
        if (range) {
          quill.deleteText(range?.index - 1, 1); // Remove extra characters
        }
      }
    }
  };

  return (
    <>
      <div className="lg:h-[10rem] h-[20rem]">
        <ReactQuill
          theme="snow"
          value={text}
          onChange={handleTextChange}
          modules={modules}
          formats={formats}
          ref={quillRef}
          //   style={{ height: "300px" }} // Adjust the height value as needed
          className="bg-[#fff] text-black h-full overflow-hidden border rounded-md "
        />
      </div>

      {maxChars && (
        <p
          className={`text-sm ms-1 ${
            filteredText.length === maxChars ? "text-red-500" : "text-gray-500"
          }`}
        >
          {maxChars - filteredText.length + " characters remaining"}
        </p>
      )}
    </>
  );
};

// Custom Checkbox
interface CheckBoxProps {
  className?: string;
  onChange: (value: boolean) => void;
  value: boolean;
}
export const CustomCheckBox = ({
  className,
  onChange,
  value,
}: CheckBoxProps) => {
  return (
    <Checkbox
      onCheckedChange={onChange}
      checked={value}
      className={`w-4 h-4 disabled:cursor-not-allowed ${className}`}
    />
  );
};
