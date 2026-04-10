import mongoose , { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken" ;

const userSchema  = new Schema({

    userName : {
        type : String,
        required : true,
    },

    MobileNumber : {
        type : Number,
        required : true,
    },

    email : {
        type : String,
        required : true,
    },

    password : {
        type : String,
        required : true,
    },

    gender : {
        type : String,
        required : true,
    },

    avtar : {
        type : String,
    },

    bio : {
        type : String,
    },

    location : {
        type : String,
    },
    
    refreshToken : {
        type : String,
    }

},

    {timestamps : true}

);

userSchema.pre("save",async function () {
    if (!this.isModified("password")) {
       return ;
    }

    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordCorrect = async function(password) {
        return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = async function(){
    return jwt.sign({
        _id : this._id,
        email : this.email, 
    },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY      
        }
)}

userSchema.methods.generateRefreshToken = async function() {
    return jwt.sign({
             _id : this._id,
        },
              process.env.REFRESH_TOKEN_SECRET,
        {
              expiresIn : process.env.REFRESH_TOKEN_EXPIRY
       }
    )
}

export const User = mongoose.model("User",userSchema);