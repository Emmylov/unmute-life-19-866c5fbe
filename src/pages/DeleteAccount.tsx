
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import AppLayout from "@/components/layout/AppLayout";
import { Loader2, AlertTriangle } from "lucide-react";
import { safeAsync } from "@/utils/error-handler";
import { toast } from "sonner";

const DeleteAccount = () => {
  const { user, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleDeleteRequest = () => {
    setError("");
    setIsConfirmDialogOpen(true);
  };

  const handleCancelDelete = () => {
    setPassword("");
    setError("");
    setIsConfirmDialogOpen(false);
  };

  const handleDeleteAccount = async () => {
    if (!user || !password) return;
    
    setIsDeleting(true);
    setError("");
    
    try {
      // Using safeAsync to handle potential network errors
      const { data: success, error: deleteError } = await safeAsync(
        () => deleteAccount(password),
        "Failed to delete account"
      );
      
      if (success) {
        toast.success("Your account has been successfully deleted");
        navigate("/");
      } else {
        setError(deleteError?.message || "Failed to delete account. Please check your password and try again.");
      }
    } catch (err) {
      console.error("Error during account deletion:", err);
      setError(
        "An error occurred while deleting your account. Please try again later or contact support."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AppLayout pageTitle="Delete Account">
      <Helmet>
        <title>Delete Account | Unmute</title>
      </Helmet>
      
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-red-100 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold">Delete Account</h1>
          </div>
          
          <div className="space-y-6">
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg">
              <p className="text-amber-800 text-sm">
                Deleting your account is permanent. All your data will be permanently 
                removed and cannot be recovered.
              </p>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-2">What happens when you delete your account:</h2>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                <li>Your profile information will be permanently deleted</li>
                <li>Your posts and comments will be removed</li>
                <li>All your personal data will be erased from our systems</li>
                <li>You'll lose access to your account and content</li>
              </ul>
            </div>
            
            <div className="pt-4">
              <Button 
                variant="destructive" 
                onClick={handleDeleteRequest}
                className="w-full sm:w-auto"
              >
                Delete My Account
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl text-red-600">Confirm Account Deletion</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Please enter your password to confirm.
            </DialogDescription>
          </DialogHeader>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password to confirm"
                disabled={isDeleting}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelDelete} disabled={isDeleting}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteAccount}
              disabled={!password || isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Account"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default DeleteAccount;
