import { fauna } from "../../../services/fauna"
import { queyr as q } from 'faunadb'
import stripe from "stripe"

export async function saveSubscribtion(
    subscriptionId: string,
    customerId: string,
    createAction = false,
) {
    // Find user in FaunaDB with customerId
    const userRef = await fauna.query(
        q.Select(
            "ref",
            q.Get(
                q.Match(
                    q.Index('user_by_stripe_customer_id'),
                    customerId
                )
            )
        )
    )

    // Save subscription data in FaunaDB
    const subscription = stripe.subscriptions.retrieve(subscriptionId)

    const subscriptionData = {
        id: subscription.id,
        userId: userRef,
        status: subscription.status,
        price_id: subscription.items.data[0].price.id,

    }

    if (createAction) {
        await fauna.query(
            q.Create(
                q.Collection('subscriptions'),
                { data: subscriptionData }
            )
        )
    } else {
        await fauna.query(
            q.Replace(
                q.Select(
                    "ref",
                    q.Get(
                        q.Match(
                            q.Index('subscription_by_id'),
                            subscriptionId,
                        )
                    )
                ),
                { data: subscriptionData }
            )
        )
    }

    return subscription
}