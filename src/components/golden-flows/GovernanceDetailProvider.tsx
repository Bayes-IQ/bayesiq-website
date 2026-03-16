"use client";

import { createContext, useContext, useCallback, useRef, useState } from "react";
import GovernanceDetailPanel from "./GovernanceDetailPanel";
import type { GovernanceDetailData } from "./GovernanceDetailPanel";

type ObjectType = "finding" | "question";

interface GovernanceDetailContextValue {
  openGovernanceDetail: (objectId: string, objectType: ObjectType) => void;
}

const GovernanceDetailContext = createContext<GovernanceDetailContextValue>({
  openGovernanceDetail: () => {},
});

export function useGovernanceDetail() {
  return useContext(GovernanceDetailContext);
}

interface Props {
  children: React.ReactNode;
  data: GovernanceDetailData | null;
}

export default function GovernanceDetailProvider({ children, data }: Props) {
  const [activeObject, setActiveObject] = useState<{
    objectId: string;
    objectType: ObjectType;
  } | null>(null);

  const dialogRef = useRef<HTMLDialogElement>(null);

  const openGovernanceDetail = useCallback(
    (objectId: string, objectType: ObjectType) => {
      setActiveObject({ objectId, objectType });
      // dialog.showModal() called via useEffect in GovernanceDetailPanel
    },
    []
  );

  const handleClose = useCallback(() => {
    // C-013: Check dialog.open before calling close()
    if (dialogRef.current?.open) {
      dialogRef.current.close();
    }
    setActiveObject(null);
  }, []);

  return (
    <GovernanceDetailContext.Provider value={{ openGovernanceDetail }}>
      {children}
      <GovernanceDetailPanel
        objectId={activeObject?.objectId ?? null}
        objectType={activeObject?.objectType ?? "finding"}
        onClose={handleClose}
        dialogRef={dialogRef}
        data={data}
      />
    </GovernanceDetailContext.Provider>
  );
}
