import { makeExecutableSchema } from "@graphql-tools/schema";

const typeDefs = /* GraphQL */ `
  type Movie {
    id: ID!
    title: String!
    genre: String!
    duration: Int!
    rating: Float!
    poster: String!
    description: String!
    showtimes: [Showtime!]!
  }

  type Showtime {
    id: ID!
    movieId: ID!
    theatre: String!
    startsAt: String!
    price: Float!
    seats: [Seat!]!
  }

  type Seat {
    id: ID!
    row: String!
    number: Int!
    booked: Boolean!
  }

  type Booking {
    id: ID!
    movieTitle: String!
    theatre: String!
    startsAt: String!
    seats: [String!]!
    total: Float!
    customerName: String!
    customerEmail: String!
    createdAt: String!
  }

  type Query {
    movies: [Movie!]!
    movie(id: ID!): Movie
    showtime(id: ID!): Showtime
    bookings: [Booking!]!
  }

  type Mutation {
    createBooking(
      showtimeId: ID!
      seatIds: [ID!]!
      customerName: String!
      customerEmail: String!
    ): Booking!
  }
`;

// ----- Mock data -----
type SeatT = { id: string; row: string; number: number; booked: boolean };
type ShowtimeT = {
  id: string;
  movieId: string;
  theatre: string;
  startsAt: string;
  price: number;
  seats: SeatT[];
};
type MovieT = {
  id: string;
  title: string;
  genre: string;
  duration: number;
  rating: number;
  poster: string;
  description: string;
  showtimes: ShowtimeT[];
};
type BookingT = {
  id: string;
  movieTitle: string;
  theatre: string;
  startsAt: string;
  seats: string[];
  total: number;
  customerName: string;
  customerEmail: string;
  createdAt: string;
};

const makeSeats = (prefix: string): SeatT[] => {
  const rows = ["A", "B", "C", "D", "E", "F"];
  const seats: SeatT[] = [];
  rows.forEach((row) => {
    for (let n = 1; n <= 8; n++) {
      seats.push({
        id: `${prefix}-${row}${n}`,
        row,
        number: n,
        booked: Math.random() < 0.15,
      });
    }
  });
  return seats;
};

const futureISO = (hoursAhead: number) =>
  new Date(Date.now() + hoursAhead * 3600 * 1000).toISOString();

const movies: MovieT[] = [
  {
    id: "m1",
    title: "Neon Skyline",
    genre: "Sci-Fi / Thriller",
    duration: 128,
    rating: 8.4,
    poster:
      "https://images.unsplash.com/photo-1518930259200-3e5c9f7a3e0a?w=800&q=80",
    description:
      "In a rain-drenched megacity, a hacker uncovers a conspiracy buried in the city's neon grid.",
    showtimes: [
      {
        id: "s1",
        movieId: "m1",
        theatre: "Cineplex Hall 1",
        startsAt: futureISO(4),
        price: 12.5,
        seats: makeSeats("s1"),
      },
      {
        id: "s2",
        movieId: "m1",
        theatre: "Cineplex Hall 3",
        startsAt: futureISO(8),
        price: 14.0,
        seats: makeSeats("s2"),
      },
    ],
  },
  {
    id: "m2",
    title: "The Last Cartographer",
    genre: "Adventure / Drama",
    duration: 142,
    rating: 7.9,
    poster:
      "https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=800&q=80",
    description:
      "An aging mapmaker undertakes one final expedition to chart an unknown coastline.",
    showtimes: [
      {
        id: "s3",
        movieId: "m2",
        theatre: "Grand Theatre",
        startsAt: futureISO(5),
        price: 11.0,
        seats: makeSeats("s3"),
      },
    ],
  },
  {
    id: "m3",
    title: "Midnight Frequency",
    genre: "Mystery / Horror",
    duration: 105,
    rating: 7.2,
    poster:
      "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&q=80",
    description:
      "A late-night radio host begins receiving transmissions from a station that doesn't exist.",
    showtimes: [
      {
        id: "s4",
        movieId: "m3",
        theatre: "Indie Cinema",
        startsAt: futureISO(6),
        price: 10.0,
        seats: makeSeats("s4"),
      },
      {
        id: "s5",
        movieId: "m3",
        theatre: "Indie Cinema",
        startsAt: futureISO(10),
        price: 10.0,
        seats: makeSeats("s5"),
      },
    ],
  },
  {
    id: "m4",
    title: "Paper Lanterns",
    genre: "Romance / Drama",
    duration: 118,
    rating: 8.1,
    poster:
      "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&q=80",
    description:
      "Two strangers cross paths during a lantern festival and rewrite each other's futures.",
    showtimes: [
      {
        id: "s6",
        movieId: "m4",
        theatre: "Riverside Screen",
        startsAt: futureISO(7),
        price: 12.0,
        seats: makeSeats("s6"),
      },
    ],
  },
];

const bookings: BookingT[] = [];

const findShowtime = (id: string) => {
  for (const m of movies) {
    const s = m.showtimes.find((x) => x.id === id);
    if (s) return { movie: m, showtime: s };
  }
  return null;
};

const resolvers = {
  Query: {
    movies: () => movies,
    movie: (_: unknown, { id }: { id: string }) =>
      movies.find((m) => m.id === id) ?? null,
    showtime: (_: unknown, { id }: { id: string }) =>
      findShowtime(id)?.showtime ?? null,
    bookings: () => [...bookings].reverse(),
  },
  Mutation: {
    createBooking: (
      _: unknown,
      args: {
        showtimeId: string;
        seatIds: string[];
        customerName: string;
        customerEmail: string;
      },
    ) => {
      const found = findShowtime(args.showtimeId);
      if (!found) throw new Error("Showtime not found");
      const { movie, showtime } = found;
      const picked = showtime.seats.filter((s) => args.seatIds.includes(s.id));
      if (picked.length !== args.seatIds.length)
        throw new Error("Some seats not found");
      if (picked.some((s) => s.booked))
        throw new Error("One or more seats already booked");
      picked.forEach((s) => (s.booked = true));
      const booking: BookingT = {
        id: `b-${Date.now()}`,
        movieTitle: movie.title,
        theatre: showtime.theatre,
        startsAt: showtime.startsAt,
        seats: picked.map((s) => `${s.row}${s.number}`),
        total: +(picked.length * showtime.price).toFixed(2),
        customerName: args.customerName,
        customerEmail: args.customerEmail,
        createdAt: new Date().toISOString(),
      };
      bookings.push(booking);
      return booking;
    },
  },
};

export const schema = makeExecutableSchema({ typeDefs, resolvers });
