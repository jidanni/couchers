import { Typography } from "@material-ui/core";
import MarkdownInput from "components/MarkdownInput";
import React, { ReactNode } from "react";
import { Control } from "react-hook-form";

interface ProfileMarkdownInputProps {
  className?: string;
  control: Control;
  defaultValue?: string;
  id: string;
  label: string;
  name: string;
  children?: ReactNode;
}

export default function ProfileMarkdownInput({
  className,
  control,
  defaultValue = "",
  id,
  label,
  name,
  children,
}: ProfileMarkdownInputProps) {
  return (
    <div className={className}>
      <Typography variant="h2" id={`${id}-label`}>
        {label}
      </Typography>
      {children}
      <MarkdownInput
        control={control}
        defaultValue={defaultValue}
        id={id}
        labelId={`${id}-label`}
        name={name}
      />
    </div>
  );
}
