import { NextResponse } from "next/server"
import { getCommerceLayerAccessToken } from "@/lib/commerce-layer-auth"

export async function POST() {
  try {
    console.log("🔗 Linking payment method to market...")

    // Get environment variables
    const clientId = process.env.NEXT_PUBLIC_CL_CLIENT_ID
    const clientSecret = process.env.NEXT_PUBLIC_CL_CLIENT_SECRET
    const scope = process.env.NEXT_PUBLIC_CL_SCOPE
    const baseUrl = process.env.COMMERCE_LAYER_BASE_URL
    const marketId = "vjkaZhNPnl"
    const paymentMethodId = "KkqYWsPzjk"

    // Validate environment variables
    if (!clientId || !clientSecret || !scope || !baseUrl) {
      console.error("❌ Missing environment variables:")
      console.error("- NEXT_PUBLIC_CL_CLIENT_ID:", !!clientId)
      console.error("- NEXT_PUBLIC_CL_CLIENT_SECRET:", !!clientSecret)
      console.error("- NEXT_PUBLIC_CL_SCOPE:", !!scope)
      console.error("- COMMERCE_LAYER_BASE_URL:", !!baseUrl)

      return NextResponse.json(
        {
          error: "Missing required environment variables",
          missing: {
            clientId: !clientId,
            clientSecret: !clientSecret,
            scope: !scope,
            baseUrl: !baseUrl,
          },
        },
        { status: 500 },
      )
    }

    console.log("📋 Configuration:")
    console.log("- Market ID:", marketId)
    console.log("- Payment Method ID:", paymentMethodId)
    console.log("- Base URL:", baseUrl)
    console.log("- Scope:", scope)
    console.log("- Client ID:", clientId.substring(0, 20) + "...")

    // Get access token with Integration App credentials
    console.log("🔑 Getting access token with Integration App credentials...")
    const accessToken = await getCommerceLayerAccessToken(clientId, clientSecret, scope)

    // Link payment method to market
    console.log("🔗 Linking payment method to market...")
    const linkPayload = {
      data: {
        id: marketId,
        type: "markets",
        relationships: {
          payment_methods: {
            data: [
              {
                type: "payment_methods",
                id: paymentMethodId,
              },
            ],
          },
        },
      },
    }

    console.log("📤 PATCH payload:", JSON.stringify(linkPayload, null, 2))

    const linkResponse = await fetch(`${baseUrl}/api/markets/${marketId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/vnd.api+json",
        Accept: "application/vnd.api+json",
      },
      body: JSON.stringify(linkPayload),
    })

    console.log("📥 Response status:", linkResponse.status)
    console.log("📥 Response headers:", Object.fromEntries(linkResponse.headers.entries()))

    if (!linkResponse.ok) {
      const errorText = await linkResponse.text()
      console.error("❌ Payment method linking failed:", linkResponse.status, errorText)

      let errorDetails
      try {
        errorDetails = JSON.parse(errorText)
        console.error("❌ Parsed error:", JSON.stringify(errorDetails, null, 2))
      } catch {
        console.error("❌ Raw error text:", errorText)
        errorDetails = { rawError: errorText }
      }

      return NextResponse.json(
        {
          error: `Payment method linking failed: ${linkResponse.status}`,
          details: errorDetails,
          status: linkResponse.status,
          request: {
            url: `${baseUrl}/api/markets/${marketId}`,
            method: "PATCH",
            payload: linkPayload,
          },
        },
        { status: 500 },
      )
    }

    const linkData = await linkResponse.json()
    console.log("✅ Payment method linked successfully!")
    console.log("📊 Response data:", JSON.stringify(linkData, null, 2))

    return NextResponse.json({
      success: true,
      message: "Payment method linked to market successfully",
      marketId: marketId,
      paymentMethodId: paymentMethodId,
      data: linkData,
    })
  } catch (error) {
    console.error("❌ Payment method linking error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Payment method linking failed",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Commerce Layer payment method linking endpoint",
    usage: "POST /api/commerce-layer/link-payment-method",
    description: "Links payment method KkqYWsPzjk to market vjkaZhNPnl",
    configuration: {
      marketId: "vjkaZhNPnl",
      paymentMethodId: "KkqYWsPzjk",
      paymentGatewayId: "PxpOwsDWKk",
      stripeTestKey: "sk_test_51RXh8DRuFMg5607c...",
    },
  })
}
