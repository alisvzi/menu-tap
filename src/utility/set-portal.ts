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
  const [portalNode, setPortalNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const node = document.getElementById(idName);
    setPortalNode(node);
  }, []);

  if (!portalNode) return null;

  return createPortal(children, portalNode);
}
