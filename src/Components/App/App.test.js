import React from "react";
import "@testing-library/jest-dom";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { rootReducer } from "../../reducers";
import App from "./App";
import { getMovies, getUserRatings } from "../../actions";
import {
  fetchMovies,
  fetchUserLogin,
  fetchUserRatings,
  getMovieDetails
} from "../../ApiCalls/ApiCalls";

jest.mock("../../ApiCalls/ApiCalls");

describe("APP Integration Tests", () => {
  let store, testWrapper, mockRatings;
  beforeEach(async () => {
    jest.clearAllMocks();
    mockRatings = [
      {
        id: 63,
        user_id: 4,
        movie_id: 1,
        rating: 5,
        created_at: "2020-04-11T02:21:06.101Z",
        updated_at: "2020-04-11T02:21:06.101Z"
      }
    ];
    store = createStore(rootReducer);
    fetchMovies.mockResolvedValue({
      movies: [
        {
          id: 1,
          title: "mock-title",
          poster_path: "mock-poster-path",
          backdrop_path: "mock-backdrop-path",
          release_date: "2020-04-05",
          overview: "mock-overview",
          average_rating: 5
        },
        {
          id: 2,
          title: "mock-title-2",
          poster_path: "mock-poster-path-2",
          backdrop_path: "mock-backdrop-path-2",
          release_date: "2020-04-05",
          overview: "mock-overview-2",
          average_rating: 5
        }
      ]
    });
    fetchUserLogin.mockResolvedValueOnce({
      user: {
        id: 1,
        email: "greg@turing.io",
        name: "Greg"
      }
    });
    fetchUserRatings.mockResolvedValue({
      ratings: [mockRatings]
    });
    getMovieDetails.mockResolvedValue({
      movie: {
        id: 1,
        title: "mock-title",
        poster_path: "mock-poster-path",
        backdrop_path: "mock-backdrop-path",
        release_date: "2020-04-05",
        overview: "mock-overview",
        average_rating: 5
      }
    });
    const history = createMemoryHistory();
    testWrapper = (
      <Provider store={store}>
        <Router history = {history}>
          <App />
        </Router>
      </Provider>
    );
  });

  it("Can render The App", () => {
    const { getByPlaceholderText, getByRole, getByText } = render(testWrapper);
    let navTitle = getByText("Rancid Tomatillos");
    expect(navTitle).toBeInTheDocument();
  });

  describe("Login User Flow", () => {
    let signInBtn,
      loginForm,
      emailInput,
      passwordInput,
      loginVariables,
      logInButton;
    beforeEach(() => {
      loginVariables = (getByPlaceholderText, getByRole, getByText) => {
        signInBtn = getByRole("button", { label: "Sign In" });
        fireEvent.click(signInBtn);
        loginForm = getByRole("form", { label: "Login Form" });
        emailInput = getByPlaceholderText("email@provider.com");
        passwordInput = getByPlaceholderText("Password");
        logInButton = getByText("Log in");
      };
    });

    it("Can Show Login Modal", () => {
      //setup
      const { getByPlaceholderText, getByRole, getByText } = render(
        testWrapper
      );
      //Executions
      loginVariables(getByPlaceholderText, getByRole, getByText);
      //assertions
      expect(loginForm).toBeInTheDocument();
      expect(emailInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
    });

    it("Can Login, Modal Closes, Displays userName in Header", async () => {
      //setup
      const { getByPlaceholderText, getByRole, getByText } = render(
        testWrapper
      );
      //Executions
      loginVariables(getByPlaceholderText, getByRole, getByText);
      //Login
      fireEvent.change(getByPlaceholderText("email@provider.com"), {
        target: { value: "greg@turing.io" }
      });
      fireEvent.change(getByPlaceholderText("Password"), {
        target: { value: "abc123" }
      });
      fireEvent.click(logInButton);
      //assertions
      await waitFor(() => expect(loginForm).not.toBeInTheDocument());
      let userGreeting = getByText("Hello, Greg");
      expect(userGreeting).toBeInTheDocument();
    });

    it("Can reject Login, Doesnt close Modal", async () => {
      //setup
      const { getByPlaceholderText, getByRole, getByText } = render(
        testWrapper
      );
      //Executions
      loginVariables(getByPlaceholderText, getByRole, getByText);
      //Login
      fireEvent.change(getByPlaceholderText("email@provider.com"), {
        target: { value: "gregturing.io" }
      });
      fireEvent.change(getByPlaceholderText("Password"), {
        target: { value: "abc123" }
      });
      fireEvent.click(logInButton);
      //assertion
      expect(loginForm).toBeInTheDocument();
      let userLoginErrorMsg = getByText("Email is not valid");
      expect(loginForm).toBeInTheDocument();
      expect(userLoginErrorMsg).toBeInTheDocument();
    });

    it("should allow for user to modify ratings when logged in", async () => {
      const { getByText, getByRole,getByPlaceholderText,debug } = render(testWrapper);
      //Executions
      loginVariables(getByPlaceholderText, getByRole, getByText);
      //Login
      fireEvent.change(getByPlaceholderText("email@provider.com"), {
        target: { value: "greg@turing.io" }
      });
      fireEvent.change(getByPlaceholderText("Password"), {
        target: { value: "abc123" }
      });
      fireEvent.click(logInButton);
      //assertions
      let userGreeting
      await waitFor(() => {userGreeting = getByText("Hello, Greg")});
      expect(userGreeting).toBeInTheDocument();
      let detailedViewLink;
      await waitFor(() => {
        detailedViewLink = getByRole("link", {
          name: "Detailed View of:mock-title"
        });
      });
      expect(detailedViewLink).toBeInTheDocument();
      fireEvent.click(detailedViewLink);
      let ratingButton;
      await waitFor(() => {
        ratingButton = getByText("Rate this movie");
      })
      expect(ratingButton).toBeInTheDocument();
    });
  });

  describe("Movie User Story", () => {
    it("Displays Movies to the Page", async () => {
      const { getByText } = render(testWrapper);
      let title = await waitFor(() => getByText("mock-title"));
      expect(title).toBeInTheDocument();
    });

    it("should display an error messsage if movies arent fetched", async () => {
      fetchMovies.mockRejectedValue("This is my error");
      const { getByText } = render(testWrapper);
            await waitFor(() =>
        expect(getByText("This is my error")).toBeInTheDocument()
      );
    });

    it("should display details about a movie", async () => {
      const { getByText, getByRole } = render(testWrapper);
      let detailedViewLink;
      await waitFor(() => {
        detailedViewLink = getByRole("link", {
          name: "Detailed View of:mock-title"
        });
      });
      expect(detailedViewLink).toBeInTheDocument();
      fireEvent.click(detailedViewLink);
      await waitFor(() => {
        expect(getByText("mock-overview")).toBeInTheDocument();
      })
    });

  });
});
