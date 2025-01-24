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
      toast("Please fill all details!");
      return;
    }
    toast("  Please wait for 5 seconds...", { icon: <AiOutlineLoading3Quarters className="h-7 w-7 animate-spin" /> });
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

    const result = await chatSession.sendMessage(FINAL_PROMPT);
    setLoading(false);
    SaveAiTrip(result?.response?.text());
  };

  const SaveAiTrip = async (TripData) => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));
    const docId = Date.now().toString();
    await setDoc(doc(db, "AiTrips", docId), {
      userSelection: formData,
      tripData: JSON.parse(TripData),
      userEmail: user?.email,
      id: docId,
    });
    setLoading(false);
    navigate("/view-trip/" + docId);
  };

  return (
    <div className="px-5 mt-12 sm:px-10 md:px-32 lg:px-56 xl:px-72">
      <h2 className="font-bold text-3xl">Tell us your travel preferences 🌍✈️🌴</h2>
      <p className="mt-3 text-gray-600 text-xl">
        Provide some basic information, and our trip planner will generate a customized itinerary
        based on your preferences.
      </p>

      <div className="mt-20 flex flex-col gap-10">
        <div className="mb-5">
          <label className="text-xl mb-3 font-medium">What is your destination of choice?</label>
          <Input
            placeholder="Enter a destination"
            value={place}
            onChange={(e) => {
              setPlace(e.target.value);
              handleInputChange("location", e.target.value); // directly set the input value
            }}
          />
        </div>

        <div className="mb-5">
          <label className="text-xl font-medium">How many days are you planning your trip?</label>
          <Input
            placeholder="e.g., 3"
            type="number"
            min="1"
            onChange={(v) => handleInputChange("totalDays", v.target.value)}
          />
        </div>

        <div>
          <label className="text-xl my-3 font-medium">What is Your Budget?</label>
          <p>The budget is exclusively allocated for activities and dining purposes.</p>
          <div className="grid grid-cols-3 gap-5 mt-5 mb-5">
            {SelectBudgetOptions.map((item, index) => (
              <div
                key={index}
                onClick={() => handleInputChange("budget", item.title)}
                className={`cursor-pointer p-4 border rounded-lg hover:shadow-lg ${formData?.budget === item.title && "shadow-lg border-cyan-500"}`}
              >
                <h2 className="text-3xl">{item.icon}</h2>
                <h2 className="font-bold text-lg">{item.title}</h2>
                <h2 className="text-sm text-gray-500">{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xl my-3 font-medium">How many people are you planning to go with?</label>
          <div className="grid grid-cols-3 gap-5 mt-5 mb-5">
            {["1", "2", "3", "4", "5+"].map((item, index) => (
              <div
                key={index}
                onClick={() => handleInputChange("people", item)}
                className={`cursor-pointer p-4 border rounded-lg hover:shadow-lg ${formData?.people === item && "shadow-lg border-cyan-500"}`}
              >
                <h2 className="text-3xl">{item}</h2>
                <h2 className="font-bold text-lg">Group of {item}</h2>
                <h2 className="text-sm text-gray-500">Select the number of travelers</h2>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xl my-3 font-medium">What is your preferred travel style?</label>
          <div className="grid grid-cols-3 gap-5 mt-5 mb-5">
            {["Adventure", "Relaxation", "Culture"].map((item, index) => (
              <div
                key={index}
                onClick={() => handleInputChange("travelStyle", item)}
                className={`cursor-pointer p-4 border rounded-lg hover:shadow-lg ${formData?.travelStyle === item && "shadow-lg border-cyan-500"}`}
              >
                <h2 className="font-bold text-lg">{item}</h2>
                <h2 className="text-sm text-gray-500">Choose your trip experience</h2>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xl my-3 font-medium">What kind of accommodation do you prefer?</label>
          <div className="grid grid-cols-3 gap-5 mt-5 mb-5">
            {["Hotel", "Airbnb", "Hostel"].map((item, index) => (
              <div
                key={index}
                onClick={() => handleInputChange("accommodation", item)}
                className={`cursor-pointer p-4 border rounded-lg hover:shadow-lg ${formData?.accommodation === item && "shadow-lg border-cyan-500"}`}
              >
                <h2 className="font-bold text-lg">{item}</h2>
                <h2 className="text-sm text-gray-500">Select your accommodation preference</h2>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xl my-3 font-medium">What transportation mode would you prefer?</label>
          <div className="grid grid-cols-3 gap-5 mt-5 mb-5">
            {["Flight", "Train", "Car"].map((item, index) => (
              <div
                key={index}
                onClick={() => handleInputChange("transportation", item)}
                className={`cursor-pointer p-4 border rounded-lg hover:shadow-lg ${formData?.transportation === item && "shadow-lg border-cyan-500"}`}
              >
                <h2 className="font-bold text-lg">{item}</h2>
                <h2 className="text-sm text-gray-500">Select your transportation mode</h2>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xl my-3 font-medium">Do you have any dietary preferences?</label>
          <Input
            placeholder="e.g., vegetarian, vegan, gluten-free"
            onChange={(e) => handleInputChange("dietaryPreference", e.target.value)}
          />
        </div>
      </div>

      <div className="my-10 flex justify-end">
        <Button onClick={OnGenerateTrip} disabled={loading}>
          {loading ? <AiOutlineLoading3Quarters className="h-7 w-7 animate-spin" /> : "Generate Trip"}
        </Button>
      </div>
    </div>
  );
}

export default CreateTrip;
