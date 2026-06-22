import { Router } from "express";
import { requireAuth } from "~/modules/authentication/authentication.middleware";
import { ItineraryService } from "./itinerary.service";

const router = Router();

// List user itineraries
router.get("/", requireAuth, async (req, res) => {
  try {
    const userId = req.user!.id;
    const items = await ItineraryService.findByUser(userId);
    res.json({ success: true, data: items });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message ?? "Failed to list itineraries" });
  }
});

// Get single itinerary
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const doc = await ItineraryService.findById(req.params.id);
    if (!doc) {
      res.status(404).json({ success: false, message: "Itinerary not found" });
      return;
    }
    if (String(doc.userId) !== req.user!.id && !doc.isPublic) {
      res.status(403).json({ success: false, message: "Forbidden" });
      return;
    }
    res.json({ success: true, data: doc });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message ?? "Failed to get itinerary" });
  }
});

// Create itinerary
router.post("/", requireAuth, async (req, res) => {
  try {
    const userId = req.user!.id;
    const doc = await ItineraryService.create(userId, req.body);
    res.status(201).json({ success: true, data: doc });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message ?? "Failed to create itinerary" });
  }
});

// Update itinerary
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const userId = req.user!.id;
    const doc = await ItineraryService.update(req.params.id, userId, req.body);
    if (!doc) {
      res.status(404).json({ success: false, message: "Itinerary not found" });
      return;
    }
    res.json({ success: true, data: doc });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message ?? "Failed to update itinerary" });
  }
});

// Delete itinerary
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const userId = req.user!.id;
    const deleted = await ItineraryService.delete(req.params.id, userId);
    if (!deleted) {
      res.status(404).json({ success: false, message: "Itinerary not found" });
      return;
    }
    res.json({ success: true, message: "Deleted" });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message ?? "Failed to delete itinerary" });
  }
});

export default router;
