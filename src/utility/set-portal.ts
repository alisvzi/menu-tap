"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function SetPortal({
  children,
  idName,
}: {
  children: React.ReactNode;
  idName: string;
}) {
  const [node, setNode] = useState<Element | null>(null);

  useEffect(() => {
    setNode(document.getElementById(idName));
  }, [idName]);

  if (!node) return null;

  return createPortal(children, node);
}
