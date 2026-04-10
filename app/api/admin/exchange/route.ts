import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  getPendingExchangeListings,
  getAllExchangeListings,
  getAllExchangeReviews,
  moderateExchangeListing,
  adminUpdateExchangeListing,
  deleteExchangeListing,
  deleteExchangeReview,
  getExchangeStats,
  getExchangeListingById,
} from "@/lib/db";

// GET /api/admin/exchange — Full admin data (admin only)
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const view = searchParams.get("view") || "pending"; // pending | all | reviews
    const status = searchParams.get("status") || undefined;
    const search = searchParams.get("search") || undefined;
    const listingId = searchParams.get("listingId");

    // Single listing detail for admin editing
    if (listingId) {
      const listing = await getExchangeListingById(parseInt(listingId));
      if (!listing) return NextResponse.json({ error: "Not found" }, { status: 404 });
      const { file_data, ...cleaned } = listing;
      return NextResponse.json({ listing: cleaned });
    }

    const stats = await getExchangeStats();

    if (view === "reviews") {
      const reviews = await getAllExchangeReviews();
      return NextResponse.json({ reviews, stats });
    }

    if (view === "all") {
      const listings = await getAllExchangeListings({ status, search });
      const cleaned = listings.map((l: Record<string, unknown>) => {
        const { file_data, ...rest } = l;
        return rest;
      });
      return NextResponse.json({ listings: cleaned, stats });
    }

    // Default: pending
    const pending = await getPendingExchangeListings();
    const cleaned = pending.map((l: Record<string, unknown>) => {
      const { file_data, ...rest } = l;
      return rest;
    });
    return NextResponse.json({ pending: cleaned, stats });
  } catch (error) {
    console.error("Admin exchange error:", error);
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 });
  }
}

// PATCH /api/admin/exchange — Moderate, edit, or manage (admin only)
export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { listingId, action, reason, updates } = body;

    if (!listingId) {
      return NextResponse.json({ error: "listingId required" }, { status: 400 });
    }

    // Moderation action (approve/reject)
    if (action === "approve" || action === "reject") {
      await moderateExchangeListing(listingId, action, reason);
      return NextResponse.json({ ok: true });
    }

    // Admin edit (update fields)
    if (updates) {
      const updated = await adminUpdateExchangeListing(listingId, updates);
      if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
      const { file_data, ...cleaned } = updated;
      return NextResponse.json({ listing: cleaned });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Admin exchange PATCH error:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

// DELETE /api/admin/exchange — Delete listing or review (admin only)
export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const listingId = searchParams.get("listingId");
    const reviewId = searchParams.get("reviewId");

    if (listingId) {
      await deleteExchangeListing(parseInt(listingId), 0, true);
      return NextResponse.json({ ok: true });
    }

    if (reviewId) {
      await deleteExchangeReview(parseInt(reviewId));
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Specify listingId or reviewId" }, { status: 400 });
  } catch (error) {
    console.error("Admin exchange DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
