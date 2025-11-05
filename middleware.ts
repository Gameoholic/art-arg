import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  if (req.nextUrl.pathname == "/step2_puppet") {
    const passwordParam = req.nextUrl.searchParams.get("password");
    if (passwordParam == null) {
      return res;
    }

    let password: number = parseFloat(passwordParam);
    if (password >= 0.000313175 && password <= 0.000367171) {
      res.cookies.set("advanceToRiddle3", "step3_assaultongiant", {
        maxAge: 10,
      });
    }
  } else if (req.nextUrl.pathname == "/step1_doll") {
    const passwordParam = req.nextUrl.searchParams.get("password");
    if (passwordParam == null) {
      return res;
    }
    if (passwordParam == "חד גדיא") {
      res.cookies.set("advanceToRiddle2", "step2_puppet", {
        maxAge: 10000000000,
      });
    }
  } else if (req.nextUrl.pathname == "/step3_assaultongiant") {
    const orderParam = req.nextUrl.searchParams.get("order");
    let penaltyCookie = req.cookies.get("penalty");
    if (
      penaltyCookie == null ||
      (penaltyCookie != null && parseFloat(penaltyCookie.value) <= Date.now())
    ) {
      console.log(orderParam);
      if (
        orderParam ==
        "arbitrary3.png,arbitrary134.png,arbitrary1.png,arbitrary21.png,arbitrary15.png,arbitrary26.png"
      ) {
        res.cookies.set("advanceToRiddle4", "stepa4_attackontitan", {
          maxAge: 10,
        });
      } else {
        // APPLY PENALTY
        // res.cookies.set("penalty", `${Date.now() + 1000 * 200}`, {
        //   // the number is the amount of seconds to force to wait
        //   maxAge: 1000000,
        // });
      }
    } else {
      // res.headers.set(
      //   "penalty",
      //   `${((parseFloat(penaltyCookie.value) - Date.now()) / 1000).toFixed()}`,
      // );
    }
  } else if (req.nextUrl.pathname == "/stepa4_attackontitan") {
    const password = req.nextUrl.searchParams.get("password");
    if (password == null) {
      return res;
    }

    if (password == "hajime") {
      res.cookies.set("advanceToRiddle5", "step5_cryptsandwyverns", {
        maxAge: 10,
      });
    }
  }
  return res;
}

export const config = {
  matcher: [
    "/step1_doll",
    "/step2_puppet",
    "/step3_assaultongiant",
    "/stepa4_attackontitan",
  ],
};
