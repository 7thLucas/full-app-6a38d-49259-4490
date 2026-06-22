import { ItineraryModel } from "./itinerary.model";
import type { Itinerary, ItineraryDay, ItineraryHotel } from "./itinerary.model";

export class ItineraryService {
  static async create(userId: string, data: Partial<Itinerary>): Promise<Itinerary> {
    const doc = await ItineraryModel.create({ ...data, userId });
    return doc.toObject();
  }

  static async findByUser(userId: string): Promise<Itinerary[]> {
    const docs = await ItineraryModel.find({ userId })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    return docs as Itinerary[];
  }

  static async findById(id: string): Promise<Itinerary | null> {
    const doc = await ItineraryModel.findById(id).lean().exec();
    return doc as Itinerary | null;
  }

  static async update(id: string, userId: string, data: Partial<Itinerary>): Promise<Itinerary | null> {
    const doc = await ItineraryModel.findOneAndUpdate(
      { _id: id, userId },
      { $set: data },
      { new: true }
    ).lean().exec();
    return doc as Itinerary | null;
  }

  static async delete(id: string, userId: string): Promise<boolean> {
    const res = await ItineraryModel.deleteOne({ _id: id, userId }).exec();
    return res.deletedCount > 0;
  }
}
