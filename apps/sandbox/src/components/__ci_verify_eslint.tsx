import { useState } from "react";

export function CiVerifyEslint({ flag }: { flag: boolean }) {
  if (flag) {
    useState(0);
  }
  return null;
}
