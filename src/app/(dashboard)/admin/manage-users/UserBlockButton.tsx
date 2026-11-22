
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

const handleBlockToggle = () => {
  const newStatus = !isBlocked;

  toast(
    newStatus ? "Block this user?" : "Unblock this user?",
    {
      description: newStatus
        ? "This user will lose access to their account."
        : "This user will be able to access their account again.",

      action: {
        label: newStatus ? "Block" : "Unblock",
        onClick: async () => {
          try {
            setIsLoading(true);

            await updateUserBlockStatus(userId, newStatus);

            setIsBlocked(newStatus);

            toast.success(
              newStatus
                ? "User blocked successfully!"
                : "User unblocked successfully!"
            );

            router.refresh();
          } catch (error) {
            toast.error(
              error instanceof Error
                ? error.message
                : "Something went wrong!"
            );
          } finally {
            setIsLoading(false);
          }
        },
      },

      cancel: {
        label: "Cancel",
        onClick: () => {},
      },

      duration: 10000,
    }
  );
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
