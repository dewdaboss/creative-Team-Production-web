import { z } from "zod";
import { getPackage, getService } from "./pricing";

export const bookingSchema = z.object({
  name: z.string().min(2, "Name is too short").max(80),
  phone: z
    .string()
    .regex(/^[+\d][\d\s-]{7,15}$/, "Enter a valid phone number")
    .transform((v) => v.replace(/[\s-]/g, "")),
  email: z
    .string()
    .email("Invalid email")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  serviceId: z.string(),
  packageId: z.string(),
  quantity: z.number().int().min(0).max(100000).optional(),
  location: z.string().min(3, "Please add your shoot location / address").max(300),
  referenceUrl: z
    .string()
    .url("Reference link must be a valid URL")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  preferredDate: z
    .string()
    .max(60)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  notes: z.string().max(1000).optional().or(z.literal("").transform(() => undefined)),
  /** honeypot — must stay empty */
  company: z.string().max(0).optional().or(z.literal("")),
});

export type BookingInput = z.infer<typeof bookingSchema>;

export interface PricedBooking {
  serviceName: string;
  packageName: string;
  unit?: string;
  unitPrice?: number;
  quantity?: number;
  estimate: number; // 0 => custom quote
}

/** Validates the picked service/package against the server catalog and prices it. */
export function priceBooking(input: BookingInput): PricedBooking {
  const service = getService(input.serviceId);
  if (!service) throw new Error("Unknown service selected");
  const pkg = getPackage(input.serviceId, input.packageId);
  if (!pkg) throw new Error("Unknown package selected");

  if (pkg.unit === "photo" || pkg.unit === "hour") {
    const qty = input.quantity && input.quantity >= (pkg.minQty ?? 1) ? input.quantity : pkg.defaultQty ?? pkg.minQty ?? 1;
    return {
      serviceName: service.name,
      packageName: pkg.name,
      unit: pkg.unitLabel ?? pkg.unit,
      unitPrice: pkg.price,
      quantity: qty,
      estimate: pkg.price * qty,
    };
  }
  return { serviceName: service.name, packageName: pkg.name, estimate: pkg.price };
}
