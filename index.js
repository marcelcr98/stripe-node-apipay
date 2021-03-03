const express = require ('express')
const stripe = require ('stripe')
('sk_test_51IPdRlGVQdBXbXkJjqTVNffab2ve4Vpr9bF7CExsAVsQMW4ut1FjfjqXFbIgiPZHDFsItquYt7CF8aO9IMqAnZTH00pUtaXg3K'); //secret_key_stripe

const cors=require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/stripe_checkout', async (req,res)=>{
    const stripeToken =req.body.stripeToken;
    const cantidad = req.body.cantidad;
    
    //cantidad para pagar y cargar el pago
    const cantidadInPen = Math.round(cantidad*100);
    const chargeObject=await stripe.charges.create({

        amount: cantidadInPen, //valor obtenido de la vista (cantidad)
        currency:'pen',  //moneda en soles (PEN)
        source:stripeToken, //valor obtenido (token)
        capture: false,
        description: 'Pago Stripe',
        receipt_email:'mcuellarr@gmail.com'
    });
    
    //captura el id y registra el pago
    try {
        await stripe.charges.capture(chargeObject.id);
        res.json(chargeObject);


    }catch(error){

        await stripe.refunds.create({charge: chargeObject.id});
        res.json(chargeObject);

    };
    
});
app.listen(3000,()=>{
    console.log('Server en PORT 3000')
})
