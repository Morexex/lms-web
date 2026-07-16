export interface Order {
    id: string
    description: string
    currency: string
    amount: number
    platform_fee: number
    net_amount: number
    status: string
    gateway: string
    gateway_reference: string | null
    invoice_number: string | null
    created_at: string | null
}

export interface CheckoutResponse {
    order: Order
    redirect_url: string | null
    instructions: string | null
}

export interface CoursePriceOption {
    currency: string
    amount: number
}

export interface RevenueSummary {
    by_currency: Array<{ currency: string; count: number; gross: number; platform_fee: number; net_payout: number }>
    paid_orders: number
    total_orders: number
}

export interface AdminOrder {
    id: string
    description: string
    currency: string
    amount: number
    platform_fee: number
    net_amount: number
    status: string
    gateway: string
    buyer: { name: string }
    created_at: string | null
}
