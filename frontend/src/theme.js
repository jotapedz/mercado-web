import { alpha, createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#14b8a6"
    },
    secondary: {
      main: "#f59e0b"
    },
    background: {
      default: "#070b14",
      paper: "#0e1525"
    },
    text: {
      primary: "#e9edf5",
      secondary: "#9aa7bd"
    }
  },
  typography: {
    fontFamily: '"Space Grotesk", "IBM Plex Sans", sans-serif',
    h4: {
      fontWeight: 700,
      letterSpacing: 0.2
    },
    h5: {
      fontWeight: 700
    },
    h6: {
      fontWeight: 700
    },
    button: {
      fontWeight: 700,
      textTransform: "none"
    }
  },
  shape: {
    borderRadius: 16
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: `1px solid ${alpha("#8ba1c9", 0.18)}`,
          boxShadow: `0 14px 30px ${alpha("#020617", 0.35)}`
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: `linear-gradient(120deg, ${alpha("#0f172a", 0.92)} 0%, ${alpha("#111827", 0.92)} 40%, ${alpha("#0f3b3b", 0.9)} 100%)`,
          backdropFilter: "blur(8px)",
          borderBottom: `1px solid ${alpha("#8ba1c9", 0.2)}`
        }
      }
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 4,
          borderRadius: 999,
          backgroundColor: "#14b8a6"
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: 52,
          color: "#9aa7bd",
          "&.Mui-selected": {
            color: "#e9edf5"
          }
        }
      }
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true
      },
      styleOverrides: {
        root: {
          borderRadius: 12,
          paddingInline: 16
        },
        containedPrimary: {
          backgroundImage: "linear-gradient(120deg, #0ea5a1 0%, #2dd4bf 100%)",
          color: "#05211f"
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: alpha("#0b1020", 0.55),
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: alpha("#8ba1c9", 0.25)
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: alpha("#8ba1c9", 0.5)
          }
        }
      }
    }
  }
});
