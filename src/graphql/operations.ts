import { gql } from "@apollo/client";

export const GET_MOVIES = gql`
  query GetMovies {
    movies {
      id
      title
      genre
      duration
      rating
      poster
      description
    }
  }
`;

export const GET_MOVIE = gql`
  query GetMovie($id: ID!) {
    movie(id: $id) {
      id
      title
      genre
      duration
      rating
      poster
      description
      showtimes {
        id
        theatre
        startsAt
        price
      }
    }
  }
`;

export const GET_SHOWTIME = gql`
  query GetShowtime($id: ID!) {
    showtime(id: $id) {
      id
      theatre
      startsAt
      price
      seats {
        id
        row
        number
        booked
      }
    }
  }
`;

export const GET_BOOKINGS = gql`
  query GetBookings {
    bookings {
      id
      movieTitle
      theatre
      startsAt
      seats
      total
      customerName
      customerEmail
      createdAt
    }
  }
`;

export const CREATE_BOOKING = gql`
  mutation CreateBooking(
    $showtimeId: ID!
    $seatIds: [ID!]!
    $customerName: String!
    $customerEmail: String!
  ) {
    createBooking(
      showtimeId: $showtimeId
      seatIds: $seatIds
      customerName: $customerName
      customerEmail: $customerEmail
    ) {
      id
      movieTitle
      seats
      total
    }
  }
`;
