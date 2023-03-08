import mongoose from 'mongoose'

interface paymentAttrs {
    orderId: string
    stripeId: string
}

interface paymentDoc extends mongoose.Document {
    orderId: string
    stripeId: string
}

interface paymentModel extends mongoose.Model<paymentDoc> {
    build(attrs: paymentAttrs): paymentDoc
}

const paymentSchema = new mongoose.Schema({
    orderId: {
        required: true,
        type: String
    },
    stripeId: {
        required: true,
        type: String
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id
            delete ret._id
        }
    }
});

paymentSchema.statics.build = (attrs: paymentAttrs) => {
    return new Payment(attrs)
}

export const Payment = mongoose.model<paymentDoc, paymentModel>('Payment', paymentSchema);