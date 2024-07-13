import TransactionStatus from "containers/TransactionStatus";

export default function Home({ query }) {
     return (
          <div>
               <TransactionStatus query={query} />
          </div>
     )
}

export async function getServerSideProps(context) {
     const { query } = context;

     return {
          props: {
               query,
          },
     };
}

