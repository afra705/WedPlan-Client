
"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { deleteService } from "@/app/all-api/service";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Props = {
  serviceId: string;
  serviceName: string;
  onDeleted: (id: string) => void;
};

const DeleteServices = ({
  serviceId,
  serviceName,
  onDeleted,
}: Props) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (loading) return;

    try {
      setLoading(true);

      await deleteService(serviceId);

      onDeleted(serviceId);

      toast.success("Service deleted successfully!");
    } catch (error) {
      console.error("Delete service error:", error);
      toast.error("Failed to delete service!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger type="button"
          title="Delete Service"
          className="rounded-lg border border-red-200 bg-white p-2 text-red-600 transition hover:bg-red-50">
 
          
  
          <Trash2 size={17} />

      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-md rounded-2xl">
        <AlertDialogHeader>
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
            <Trash2 className="text-red-600" size={23} />
          </div>

          <AlertDialogTitle className="text-xl text-[#4A1F2A]">
            Delete Service?
          </AlertDialogTitle>

          <AlertDialogDescription className="text-sm leading-6 text-[#8B7478]">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-[#4A1F2A]">
              {serviceName}
            </span>
            ? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={loading}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Yes, Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteServices;
