import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter, useNavigate, Routes, Route } from "react-router-dom";
import Trips from "./Trips"; // Your Trips component
import TripDetails from "./TripDetails"; // Your TripDetails component
import { TripsContext } from "../../context/TripsContext";
import NotFound from "../NotFound";

jest.mock("../../utils/fetchTripDetails"); // Mock fetchTripDetails
jest.mock("../../utils/fetchTripBySlug"); // Mock fetchTripBySlug
jest.mock("../NotFound"); // Mock NotFound
jest.mock("../../utils/slugify", () => ({
  slugify: (text) => text.toLowerCase().replace(/ /g, "-"), // Simplified slugify mock
}));

describe("Trips and TripDetails Integration", () => {
  it("should redirect to 404 if clicking on a trip card leads to a non-existent trip", async () => {
    const mockTrips = [
      {
        _id: "1",
        tripName: "Test Trip",
        country: "Test Country",
        destinations: [
          {
            city: "Test City",
            startDate: "2025-02-14T00:00:00.000Z",
            endDate: "2025-02-17T00:00:00.000Z",
          },
        ],
      },
    ];

    const mockFetchTripBySlug = jest.fn().mockResolvedValue(null); // Trip not found!
    fetchTripBySlug.mockImplementation(mockFetchTripBySlug);

    render(
      <MemoryRouter initialEntries={["/trips"]}>
        <TripsContext.Provider
          value={{ trips: mockTrips, fetchTrips: jest.fn() }}
        >
          <Routes>
            <Route path="/trips" element={<Trips />} />
            <Route path="/trips/:tripSlug" element={<TripDetails />} />
            <Route path="/404" element={<NotFound />} />
          </Routes>
        </TripsContext.Provider>
      </MemoryRouter>
    );

    // Click on the trip card (simulate navigation)
    const tripCard = screen.getByRole("listitem"); // Or any other query you use to select the card
    fireEvent.click(tripCard);

    await waitFor(() => {
      expect(mockFetchTripBySlug).toHaveBeenCalledWith("test-trip");
      expect(screen.getByRole("heading", { name: /404/i })).toBeInTheDocument(); // Assert 404 page
    });
  });

  // ... other tests
});
