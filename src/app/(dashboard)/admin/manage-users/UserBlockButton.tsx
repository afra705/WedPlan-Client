
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Ban, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { updateUserBlockStatus } from "@/app/all-api/block";

type Props = {
  userId: string;
  initialBlocked: boolean;
};

const UserBlockButton = ({
  userId,
  initialBlocked,
}: Props) => {
  const [isBlocked, setIsBlocked] = useState(initialBlocked);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleBlockToggle = async () => {
    try {
      setIsLoading(true);

      const newStatus = !isBlocked;

      await updateUserBlockStatus(userId, newStatus);

      setIsBlocked(newStatus);

      router.refresh();

      toast.success(
        newStatus
          ? "User blocked successfully!"
          : "User unblocked successfully!"
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleBlockToggle}
      disabled={isLoading}
      className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
        isBlocked
          ? "bg-green-50 text-green-600 hover:bg-green-100"
          : "bg-red-50 text-red-600 hover:bg-red-100"
      }`}
    >
      {isBlocked ? (
        <>
          <ShieldCheck size={14} />
          {isLoading ? "Please wait..." : "Unblock"}
        </>
      ) : (
        <>
          <Ban size={14} />
          {isLoading ? "Please wait..." : "Block"}
        </>
      )}
    </button>
  );
};

export default UserBlockButton;
