<<<<<<< HEAD
"use client"
=======
"use client";
>>>>>>> dev

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
<<<<<<< HEAD
} from "~/components/ui/toast"
import { useToast } from "~/components/ui/use-toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
=======
} from "~/components/ui/toast";
import { useToast } from "~/components/ui/use-toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider duration={3000}>
>>>>>>> dev
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
<<<<<<< HEAD
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
=======
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
>>>>>>> dev
}
