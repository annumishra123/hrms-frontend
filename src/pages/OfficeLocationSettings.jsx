import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MapPin, LocateFixed, Save, Building2 } from "lucide-react";
import {
  fetchOfficeLocation,
  saveOfficeLocation,
} from "../features/officeLocation/officeLocationSlice";

export default function OfficeLocationSettings() {
  const dispatch = useDispatch();
  const { office, status, saveStatus, error } = useSelector((s) => s.officeLocation);

  const [form, setForm] = useState({
    name: "",
    address: "",
    lat: "",
    lng: "",
    radiusMeters: 20,
  });
  const [locating, setLocating] = useState(false);
  const [saveMsg, setSaveMsg] = useState(null);

  useEffect(() => {
    dispatch(fetchOfficeLocation());
  }, [dispatch]);

  // Jab office DB se aa jaye, form ko pre-fill karo
  useEffect(() => {
    if (office) {
      setForm({
        name: office.name || "",
        address: office.address || "",
        lat: office.lat,
        lng: office.lng,
        radiusMeters: office.radiusMeters,
      });
    }
  }, [office]);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setSaveMsg({ type: "error", text: "Is browser mein geolocation support nahi hai." });
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((f) => ({
          ...f,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }));
        setLocating(false);
      },
      (err) => {
        setSaveMsg({ type: "error", text: "Location fetch nahi ho payi: " + err.message });
        setLocating(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveMsg(null);

    if (!form.lat || !form.lng) {
      setSaveMsg({ type: "error", text: "Latitude aur longitude bharna zaroori hai." });
      return;
    }

    const result = await dispatch(saveOfficeLocation(form));
    if (saveOfficeLocation.fulfilled.match(result)) {
      setSaveMsg({ type: "success", text: "Office location successfully save ." });
    } else {
      setSaveMsg({ type: "error", text: result.payload || "Save karne mein error aayi." });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white shadow-soft">
          <Building2 size={20} strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="font-display font-bold text-lg text-navy-900">Office Location</h1>
          <p className="text-sm text-navy-500">
            Yahan se office ki location set karein — login sirf isi location ke radius ke andar hi allowed hoga.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-soft border border-navy-100 p-6 space-y-5"
      >
        <div>
          <label className="block text-sm font-semibold text-navy-700 mb-1">Office Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Head Office"
            className="w-full rounded-lg border border-navy-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-navy-700 mb-1">Address (optional)</label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="e.g. XYZ Building, Lucknow"
            className="w-full rounded-lg border border-navy-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-navy-700 mb-1">Latitude</label>
            <input
              type="text"
              name="lat"
              value={form.lat}
              onChange={handleChange}
              placeholder="26.8467"
              className="w-full rounded-lg border border-navy-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-navy-700 mb-1">Longitude</label>
            <input
              type="text"
              name="lng"
              value={form.lng}
              onChange={handleChange}
              placeholder="80.9462"
              className="w-full rounded-lg border border-navy-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-navy-700 mb-1">
            Allowed Radius (meters)
          </label>
          <input
            type="number"
            name="radiusMeters"
            value={form.radiusMeters}
            onChange={handleChange}
            min={5}
            className="w-full rounded-lg border border-navy-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <p className="text-xs text-navy-400 mt-1">
            Mobile GPS accuracy generally 5-15m hoti hai, isliye 15-30m recommended hai.
          </p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={useCurrentLocation}
            disabled={locating}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-navy-100 text-navy-700 hover:bg-navy-200 transition-colors disabled:opacity-60"
          >
            <LocateFixed size={16} />
            {locating ? "Locating..." : "Use My Current Location"}
          </button>

          <button
            type="submit"
            disabled={saveStatus === "loading"}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-brand-600 text-white hover:bg-brand-700 transition-colors disabled:opacity-60"
          >
            <Save size={16} />
            {saveStatus === "loading" ? "Saving..." : "Save Location"}
          </button>
        </div>

        {saveMsg && (
          <div
            className={`text-sm rounded-lg px-3 py-2 ${
              saveMsg.type === "success"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {saveMsg.text}
          </div>
        )}
      </form>

      {status === "succeeded" && office && (
        <div className="mt-5 flex items-start gap-2 text-sm text-navy-500">
          <MapPin size={16} className="mt-0.5" />
          <p>
            Current set location: <b>{office.address || office.name}</b> — Lat {office.lat}, Lng{" "}
            {office.lng}, Radius {office.radiusMeters}m
          </p>
        </div>
      )}
    </div>
  );
}