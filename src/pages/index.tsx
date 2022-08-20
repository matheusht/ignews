import { GetStaticProps } from 'next'
import Head from '../../node_modules/next/head';
import { SubscribeButton } from '../components/SubscribeButton/index';
import { stripe } from '../services/stripe';
import styles from './home.module.scss';

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  }
}

export default function Home({ product }: HomeProps) {



  return (
    <>
      <Head>
        <title> Home | ig.news</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, Welcome </span>
          <h1>News about the <span>React</span> World.</h1>
          <p>
            Get acess to all the publications <br />
            <span>for {product.amount} a month</span>
          </p>
          <SubscribeButton priceId={product.priceId} />
        </section>

        <img src="/images/avatar.svg" alt="Girl coding" />
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1LV1QoEe49EYERNfJkGz8ls2')

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price.unit_amount / 100)

  };

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24, //24 hours
  }

}