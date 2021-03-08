const express = require ('express')
const stripe = require ('stripe')
('sk_test_51IPdRlGVQdBXbXkJjqTVNffab2ve4Vpr9bF7CExsAVsQMW4ut1FjfjqXFbIgiPZHDFsItquYt7CF8aO9IMqAnZTH00pUtaXg3K'); //secret_key_stripe

//Llave pública para la vista:  pk_test_51IPdRlGVQdBXbXkJkKE7KAH3OxbaDYpuTOujh3w50dc9T4m98Qw0IUUwcoG34RyNGllLGc6aLV1yDC7WuUm2GEdP00A73T1zQa

const cors=require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/stripe_checkout', async (req,res)=>{
    const stripeToken =req.body.stripeToken;
    const cantidad = req.body.cantidad;
    const correo = req.body.correo;


    //cantidad para pagar y cargar el pago

    const cantidadInPen = Math.round(cantidad*100);
    const chargeObject=await stripe.charges.create({

        amount: cantidadInPen, //valor obtenido de la vista (cantidad)
        currency:'pen',  //moneda en soles (PEN)
        source:stripeToken, //valor obtenido (token)
        capture: false,
        description: 'Pago Stripe',
        receipt_email:correo
        
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
