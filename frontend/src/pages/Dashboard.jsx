import { useEffect, useState } from "react";
import api from "../services/api";
import Cookies from "js-cookie";
import Navbar from "../components/Navbar";

import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {

  const [analytics, setAnalytics] = useState(null);
  const [scope, setScope] = useState("user");

  const [filters, setFilters] = useState({
    start_date: Cookies.get("start_date") || "",
    end_date: Cookies.get("end_date") || "",
    age: Cookies.get("age") || "",
    gender: Cookies.get("gender") || "",
  });

  const [selectedFeature, setSelectedFeature] = useState(null);


  // AUTO FETCH WHEN FILTERS / FEATURE / SCOPE CHANGE
  useEffect(() => {
    fetchAnalytics();
  }, [selectedFeature, scope, filters]);


  // TRACK USER INTERACTION
  const trackFeature = async (feature) => {
    try {
      await api.post("/track", {
        feature_name: feature,
      });
    } catch (err) {
      console.error("Tracking failed:", err);
    }
  };


  // FETCH ANALYTICS DATA
  const fetchAnalytics = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await api.get("/analytics", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          ...(filters.start_date && { start_date: filters.start_date }),
          ...(filters.end_date && { end_date: filters.end_date }),
          ...(filters.age && { age: filters.age }),
          ...(filters.gender && { gender: filters.gender }),
          ...(selectedFeature && { feature_name: selectedFeature }),
          scope,
        },
      });

      setAnalytics(res.data);

    } catch (err) {

      console.error("Analytics error:", err.response?.data);

    }

  };


  if (!analytics) {
    return <div className="p-10">Loading analytics...</div>;
  }


  // BAR CHART DATA
  const featureData = Object.entries(
    analytics.feature_usage
  ).map(([feature, count]) => ({
    feature,
    count,
  }));


  // TIMELINE DATA
  const timelineData = Object.entries(
    analytics.timeline_usage
  )
    .sort((a, b) => new Date(a[0]) - new Date(b[0]))
    .map(([date, count]) => ({
      date,
      count,
    }));


  // TOP FEATURE
  const topFeature =
    Object.entries(analytics.feature_usage)
      .sort((a, b) => b[1] - a[1])[0]?.[0];


  return (
    <>
      <Navbar setToken={() => window.location.reload()} />

      <div className="p-10 space-y-10 bg-gray-100 min-h-screen">

        <h1 className="text-3xl font-bold">
          Analytics Dashboard 📊
        </h1>


        {/* USER / GLOBAL TOGGLE */}
        <div className="flex gap-3">

          <button
            onClick={() => setScope("user")}
            className={`px-4 py-2 rounded ${
              scope === "user"
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
          >
            My Analytics
          </button>

          <button
            onClick={() => setScope("global")}
            className={`px-4 py-2 rounded ${
              scope === "global"
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
          >
            Global Analytics
          </button>

        </div>


        {/* FILTER PANEL */}
        <div className="bg-white p-6 rounded-xl shadow flex gap-4 flex-wrap items-center border">


          {/* DATE FILTER */}
          <input
            type="date"
            value={filters.start_date}
            className="border p-2 rounded"
            onChange={(e) => {

              Cookies.set("start_date", e.target.value);

              setFilters({
                ...filters,
                start_date: e.target.value,
              });

              trackFeature("date_picker");
            }}
          />


          <input
            type="date"
            value={filters.end_date}
            className="border p-2 rounded"
            onChange={(e) => {

              Cookies.set("end_date", e.target.value);

              setFilters({
                ...filters,
                end_date: e.target.value,
              });

              trackFeature("date_picker");
            }}
          />


          {/* AGE FILTER */}
          <select
            value={filters.age}
            className="border p-2 rounded"
            onChange={(e) => {

              Cookies.set("age", e.target.value);

              setFilters({
                ...filters,
                age: e.target.value,
              });

              trackFeature("filter_age");
            }}
          >
            <option value="">Age</option>
            <option value="lt18">&lt;18</option>
            <option value="18to40">18–40</option>
            <option value="gt40">&gt;40</option>
          </select>


          {/* GENDER FILTER */}
          <select
            value={filters.gender}
            className="border p-2 rounded"
            onChange={(e) => {

              Cookies.set("gender", e.target.value);

              setFilters({
                ...filters,
                gender: e.target.value,
              });

              trackFeature("filter_gender");
            }}
          >
            <option value="">Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>


          {/* APPLY FILTERS BUTTON */}
          <button
            onClick={() => {
              trackFeature("apply_filters");
              fetchAnalytics();
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Apply Filters
          </button>

        </div>


        {/* METRIC CARDS */}
        <div className="grid grid-cols-3 gap-6">

          <div className="bg-white shadow rounded-xl p-6">
            <p>Total Clicks</p>
            <h2 className="text-3xl font-bold">
              {analytics.total_clicks}
            </h2>
          </div>

          <div className="bg-white shadow rounded-xl p-6">
            <p>Top Feature</p>
            <h2 className="text-2xl font-bold">
              {topFeature || "N/A"}
            </h2>
          </div>

          <div className="bg-white shadow rounded-xl p-6">
            <p>Tracked Days</p>
            <h2 className="text-2xl font-bold">
              {Object.keys(analytics.timeline_usage).length}
            </h2>
          </div>

        </div>


        {/* RESET FEATURE FILTER */}
        <button
          onClick={() => setSelectedFeature(null)}
          className="mb-4 text-sm text-blue-600 underline"
        >
          Reset Feature Filter
        </button>


        {/* FEATURE ANALYTICS TITLE */}
        <h2 className="text-lg font-semibold text-gray-700">
          Feature Analytics
        </h2>


        {/* BAR CHART */}
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={featureData}
            onClick={(state) => {

              if (state?.activeLabel) {

                setSelectedFeature(state.activeLabel);

                trackFeature("chart_bar");

              }

            }}
          >

            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="feature" />
            <YAxis />

            <Tooltip formatter={(value) => [`${value} clicks`, "Usage"]} />

            <Bar dataKey="count">

              {featureData.map((entry, index) => (

                <Cell
                  key={index}
                  fill={
                    entry.feature === selectedFeature
                      ? "#ef4444"
                      : "#3b82f6"
                  }
                />

              ))}

            </Bar>

          </BarChart>
        </ResponsiveContainer>


        {/* TIMELINE LABEL */}
        {selectedFeature && (
          <p className="text-sm text-gray-600 mb-2">
            Showing clicks daily for: <b>{selectedFeature}</b>
          </p>
        )}


        {/* TIMELINE TITLE */}
        <h2 className="text-lg font-semibold text-gray-700">
          Activity Timeline
        </h2>


        {/* LINE CHART */}
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timelineData}>

            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />

            <Tooltip formatter={(value) => [`${value} clicks`, "Usage"]} />

            <Line
              type="monotone"
              dataKey="count"
              stroke="#10b981"
              strokeWidth={3}
            />

          </LineChart>
        </ResponsiveContainer>


      </div>
    </>
  );
}