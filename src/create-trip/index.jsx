import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { AI_PROMPT, SelectBudgetOptions } from "@/constants/options";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { chatSession } from "@/service/AIModal";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/service/firebaseConfig";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function CreateTrip() {
  const [place, setPlace] = useState("");
  const [formData, setFormData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const OnGenerateTrip = async () => {
    const user = localStorage.getItem("user");
    if (!user) {
      setOpenDialog(true);
      return;
    }
    if (!formData?.location || !formData?.budget) {
      toast("Please fill all required details!");
      return;
    }
    toast(" Crafting your perfect journey wait for 10 seconds", {
      icon: <AiOutlineLoading3Quarters className="h-7 w-7 animate-spin text-[#7C3AED]" />,
    });
    setLoading(true);
    
    const FINAL_PROMPT = AI_PROMPT
      .replace("{location}", formData?.location)
      .replace("{totalDays}", formData?.totalDays)
      .replace("{traveler}", formData?.traveler)
      .replace("{budget}", formData?.budget)
      .replace("{travelStyle}", formData?.travelStyle)
      .replace("{accommodation}", formData?.accommodation)
      .replace("{transportation}", formData?.transportation)
      .replace("{dietaryPreference}", formData?.dietaryPreference);

    try {
      const result = await chatSession.sendMessage(FINAL_PROMPT);
      SaveAiTrip(result?.response?.text());
    } catch (error) {
      toast.error("Failed to generate trip. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const SaveAiTrip = async (TripData) => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const docId = Date.now().toString();
      await setDoc(doc(db, "AiTrips", docId), {
        userSelection: formData,
        tripData: JSON.parse(TripData),
        userEmail: user?.email,
        id: docId,
      });
      navigate("/view-trip/" + docId);
    } catch (error) {
      toast.error("Failed to save trip. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-5 mt-12 sm:px-10 md:px-32 lg:px-56 xl:px-72">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="font-bold text-4xl bg-gradient-to-r from-[#7C3AED] to-[#EC4899] bg-clip-text text-transparent">
          Craft Your Perfect Journey 🌍
        </h2>
        <p className="mt-3 text-gray-600 text-xl">
          Share your travel dreams with us, and watch as AI weaves them into a bespoke adventure
        </p>
      </motion.div>

      <div className="mt-20 flex flex-col gap-10">
        {/* Destination Input */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="mb-5 space-y-2">
            <label className="text-xl font-medium text-gray-800">Dream Destination</label>
            <Input
              placeholder="Where does your heart want to wander? e.g., Japan"
              className="rounded-xl py-6 text-lg border-2 focus:border-[#7C3AED] transition-all"
              value={place}
              onChange={(e) => {
                setPlace(e.target.value);
                handleInputChange("location", e.target.value);
              }}
            />
          </div>
        </motion.div>

        {/* Trip Duration */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
        >
          <div className="mb-5 space-y-2">
            <label className="text-xl font-medium text-gray-800">Adventure Duration</label>
            <Input
              placeholder="How many days of magic?"
              type="number"
              min="1"
              className="rounded-xl py-6 text-lg border-2 focus:border-[#7C3AED]"
              onChange={(v) => handleInputChange("totalDays", v.target.value)}
            />
          </div>
        </motion.div>

        {/* Budget Selection */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
        >
          <div className="space-y-2">
            <label className="text-xl font-medium text-gray-800">Treasure Chest Size</label>
            <p className="text-gray-500">(For experiences and culinary delights)</p>
            <div className="grid grid-cols-3 gap-5 mt-5">
              {SelectBudgetOptions.map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className={`cursor-pointer p-6 border-2 rounded-2xl transition-all ${
                    formData?.budget === item.title
                      ? "border-[#7C3AED] bg-gradient-to-b from-[#7C3AED]/10 to-transparent"
                      : "hover:border-[#7C3AED]/40"
                  }`}
                  onClick={() => handleInputChange("budget", item.title)}
                >
                  <span className="text-4xl block mb-3">{item.icon}</span>
                  <h2 className="font-bold text-lg text-gray-800">{item.title}</h2>
                  <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Travel Group */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
        >
          <div className="space-y-2">
            <label className="text-xl font-medium text-gray-800">Companion Crew</label>
            <div className="grid grid-cols-3 gap-5 mt-5">
              {["1", "2", "3", "4", "5+"].map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className={`cursor-pointer p-6 border-2 rounded-2xl text-center transition-all ${
                    formData?.people === item
                      ? "border-[#EC4899] bg-gradient-to-b from-[#EC4899]/10 to-transparent"
                      : "hover:border-[#EC4899]/40"
                  }`}
                  onClick={() => handleInputChange("people", item)}
                >
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">{item}</h2>
                  <p className="text-sm text-gray-500">Travel Companions</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Travel Style */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
        >
          <div className="space-y-2">
            <label className="text-xl font-medium text-gray-800">Experience Mode</label>
            <div className="grid grid-cols-3 gap-5 mt-5">
              {["Adventure", "Relaxation", "Culture"].map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className={`cursor-pointer p-6 border-2 rounded-2xl text-center transition-all ${
                    formData?.travelStyle === item
                      ? "border-[#7C3AED] bg-gradient-to-b from-[#7C3AED]/10 to-transparent"
                      : "hover:border-[#7C3AED]/40"
                  }`}
                  onClick={() => handleInputChange("travelStyle", item)}
                >
                  <h2 className="font-bold text-lg text-gray-800">{item}</h2>
                  <p className="text-sm text-gray-500 mt-2">Travel Vibe</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Accommodation Preference */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
        >
          <div className="space-y-2">
            <label className="text-xl font-medium text-gray-800">Resting Nest</label>
            <div className="grid grid-cols-3 gap-5 mt-5">
              {["Hotel", "Airbnb", "Hostel"].map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className={`cursor-pointer p-6 border-2 rounded-2xl text-center transition-all ${
                    formData?.accommodation === item
                      ? "border-[#EC4899] bg-gradient-to-b from-[#EC4899]/10 to-transparent"
                      : "hover:border-[#EC4899]/40"
                  }`}
                  onClick={() => handleInputChange("accommodation", item)}
                >
                  <h2 className="font-bold text-lg text-gray-800">{item}</h2>
                  <p className="text-sm text-gray-500 mt-2">Sleeping Quarters</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Transportation Mode */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.6 }}
        >
          <div className="space-y-2">
            <label className="text-xl font-medium text-gray-800">Journey Vehicle</label>
            <div className="grid grid-cols-3 gap-5 mt-5">
              {["Flight", "Train", "Car"].map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className={`cursor-pointer p-6 border-2 rounded-2xl text-center transition-all ${
                    formData?.transportation === item
                      ? "border-[#7C3AED] bg-gradient-to-b from-[#7C3AED]/10 to-transparent"
                      : "hover:border-[#7C3AED]/40"
                  }`}
                  onClick={() => handleInputChange("transportation", item)}
                >
                  <h2 className="font-bold text-lg text-gray-800">{item}</h2>
                  <p className="text-sm text-gray-500 mt-2">Travel Method</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Dietary Preferences */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.7 }}
        >
          <div className="space-y-2">
            <label className="text-xl font-medium text-gray-800">Culinary Preferences</label>
            <Input
              placeholder="e.g., vegetarian, vegan, gluten-free"
              className="rounded-xl py-6 text-lg border-2 focus:border-[#7C3AED]"
              onChange={(e) => handleInputChange("dietaryPreference", e.target.value)}
            />
          </div>
        </motion.div>

        {/* Generate Button */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.8 }}
        >
          <div className="my-10 flex justify-end">
            <Button 
              onClick={OnGenerateTrip} 
              disabled={loading}
              className="rounded-xl px-8 py-6 text-lg bg-gradient-to-r from-[#7C3AED] to-[#EC4899] hover:from-[#8B5CF6] hover:to-[#F472B6] transition-all shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <AiOutlineLoading3Quarters className="h-7 w-7 animate-spin text-white" />
              ) : (
                "✨ Craft My Journey"
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default CreateTrip;