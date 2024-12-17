import { useState } from "react";
import { BACKEND_DOMAIN } from "../api_host";
import {
  Box,
  Grid,
  Button,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { amber } from "@mui/material/colors";
import { HiOutlineMail } from "react-icons/hi";
import { GiPadlock } from "react-icons/gi";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import "./style.css";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); 
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "email") {
      setEmail(value);
      setIsValidEmail(emailRegex.test(value));
    } else if (name === "password") {
      setPassword(value);
      setIsValidPassword(value.length >= 8);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!isValidEmail || !isValidPassword) {
      setErrorMessage("Please enter valid email and password.");
      return;
    }
  
    try {
      const response = await fetch(`${BACKEND_DOMAIN}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: email,
          password: password,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        const { tokens, user } = data.data;
        localStorage.setItem("accessToken", tokens.access);
        localStorage.setItem("refreshToken", tokens.refresh);
        localStorage.setItem("user", JSON.stringify(user)); // Store user data
  
        navigate("/dashboard");
      } else {
        setErrorMessage(
          data.message || "Login failed. Please check your credentials."
        );
      }
    } catch {
      setErrorMessage("An error occurred. Please try again later.");
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ minHeight: "100vh" }}
    >
      <Grid item xs={12} sm={8} md={4}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            padding: 4,
            backgroundColor: "white",
          }}
        >
          <Box sx={{ textAlign: "center", marginBottom: 0 }}>
            <img src="logo.png" alt="MTN Logo" height={60} />
          </Box>

          <Typography
            variant="h5"
            sx={{ textAlign: "center", marginBottom: 4, color: "black" }}
          >
            Roaming Partners Portal
          </Typography>

          {/* Email Field */}
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={email}
            onChange={handleChange}
            placeholder="mail@mtn.com"
            error={!isValidEmail}
            helperText={!isValidEmail ? "Invalid email format" : ""}
            InputProps={{
              startAdornment: <HiOutlineMail size={20} color="grey" />,
            }}
            sx={{
              marginBottom: 3,
              "& .MuiOutlinedInput-root": {
                height: "40px",
                "& .MuiInputBase-input": {
                  height: "100%",
                  padding: "16px 14px",
                },
                "& fieldset": {
                  borderColor: "grey",
                },
                "&:hover fieldset": {
                  borderColor: "#ffca28",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#ffca28",
                },
              },
              "& .MuiInputLabel-root": {
                color: "black",
              },
            }}
          />

          {/* Password Field with Visibility Toggle */}
          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"} // Toggle between text and password
            value={password}
            onChange={handleChange}
            placeholder="Enter your password"
            error={!isValidPassword}
            helperText={
              !isValidPassword ? "Password must be at least 8 characters" : ""
            }
            InputProps={{
              startAdornment: <GiPadlock size={20} color="grey" />,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={togglePasswordVisibility}
                    edge="end"
                  fontSize= {9}
                  >
                    {showPassword ? (
                      <VisibilityOff color="grey" />
                    ) : (
                      <Visibility color="grey" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              marginBottom: 3,
              "& .MuiOutlinedInput-root": {
                height: "40px",
                "& .MuiInputBase-input": {
                  height: "100%",
                  padding: "0 14px",
                  textAlign: "left",
                },
                "& fieldset": {
                  borderColor: "grey",
                },
                "&:hover fieldset": {
                  borderColor: "#ffca28",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#ffca28",
                },
              },
              "& .MuiInputLabel-root": {
                color: "black",
              },
            }}
          />

          {errorMessage && (
            <Typography color="error" sx={{ marginBottom: 2 }}>
              {errorMessage}
            </Typography>
          )}

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* <a href="#" className="forgot-password">
              Forgot Password?
            </a> */}
          </Box>

          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{
              marginTop: 2,
              textTransform: "none",
              backgroundColor: "#FFCB05",
              color: "black",
              boxShadow: "none",
              "&:hover": {
                backgroundColor: amber[300],
                boxShadow: "none",
              },
            }}
          >
            Sign In
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
}
