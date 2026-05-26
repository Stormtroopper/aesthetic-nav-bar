import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ApolloProvider } from "@apollo/client/react";
import { Provider as ReduxProvider } from "react-redux";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { apolloClient } from "@/graphql/apollo";
import { store } from "@/store";
import Movies from "./pages/Movies.tsx";
import MovieDetail from "./pages/MovieDetail.tsx";
import SeatSelection from "./pages/SeatSelection.tsx";
import Checkout from "./pages/Checkout.tsx";
import Bookings from "./pages/Bookings.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <ReduxProvider store={store}>
    <ApolloProvider client={apolloClient}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Movies />} />
              <Route path="/movies/:id" element={<MovieDetail />} />
              <Route path="/showtimes/:id" element={<SeatSelection />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/bookings" element={<Bookings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ApolloProvider>
  </ReduxProvider>
);

export default App;
