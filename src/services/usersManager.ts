import UserModel from "../models/users";

class UsersManager {
    constructor() {}

    async createUser(user: object) {
      try {
        const newUser = new UserModel(user);

        await newUser.save();

        return newUser;
      } catch (error) {
          console.error('Error al crear usuario:', error);
          return false;
      }
    }

    async updateRemainingValue(userId: string, value: number){
      try { 
        const user: any = await UserModel.findOne({ _id: userId }); 

        if(!user){
          return
        }

        const valueSpended: number = user.totalSpendAmount
        const valueStarted: number = user.totalAmountToSpend

        const differenceAfter: number = valueStarted - valueSpended

        let newValueDifference: number = 0

        if(value > differenceAfter){
          newValueDifference = value - differenceAfter
          user.totalAmountToSpend += newValueDifference
        }else if(value < differenceAfter){
          newValueDifference = differenceAfter - value
          user.totalAmountToSpend -= newValueDifference
        }else{
          return
        }

        await user.save()

        return user

      } catch (error) {
        console.log("Error al cambiar la contraseña:", error);
        return;
      }
    }

    async changePassword(email: string, newPassword: string){
        try {
            const user: any = await UserModel.findOne({ email: email });
            if (user.password !== newPassword) {
                user.password = newPassword;
                await user.save();

                return user;
            } else {
                console.log("La contraseña es la misma que tenías antes");
                return false;
            }
        } catch (error) {
            console.log("Error al cambiar la contraseña:", error);
            return false;
        }
    }

    async findUserByEmail(email: string): Promise<boolean> {
        try {
          const user: any = await UserModel.findOne({ email });
    
          if (!user) {
            return false;
          }
    
          return true;
        } catch (error) {
          console.log(error)
          throw error;
        }
    }

    async updateUserById(userId: string, updateData: Object) {
        try {
          const user: any = await UserModel.findByIdAndUpdate(userId, updateData, {
            new: true,
          });
          if (!user) {
            console.log(`User con id "${userId}" no encontrado`);
            return false;
          }
          return user.toJSON();
        } catch (error) {
          console.log("Error bloque catch updateUserbyId");
          return false;
        }
    }

    async startUser(userId: string, amount: number){
      try {
        const user: any = await UserModel.findOne({ _id: userId }); 

        if(!user){
          return false;
        }

        user.totalAmountToSpend = amount;

        user.save();

        return user;

      } catch (error) {
        console.log("Error bloque catch startUser");
          return ;
      }
        
    }

    async newExpense(amount: number, description: string, userId: string){

      try {
        const user: any = await UserModel.findOne({ _id: userId }); 

        if(!user){
          return false;
        }

        const pushNewExpense = {
          amount,
          description,
        }

        user.gastos.push(pushNewExpense);

        user.totalSpendAmount += amount;

        await user.save();

        return user;

      } catch (error) {
        console.log("Error bloque catch startUser");
        return ;
      }

    }

    async deleteSpent(gastoId: string, userId: string){

      try {
        // Encontrar el usuario y el gasto que se eliminará
        const user = await UserModel.findOne({ _id: userId });
        if (!user) {
            return null;
        }

        const deletedGasto = user.gastos.find(gasto => gasto._id?.toString() === gastoId);
        if (!deletedGasto) {
            return null;
        }

        // Obtener el monto del gasto eliminado
        const deletedAmount = deletedGasto.amount;
        let newTotalAmount = 0;
        if(deletedAmount) newTotalAmount =  user.totalAmountToSpend + deletedAmount

        // Actualizar el total de gastos del usuario y eliminar el gasto
        const result: any = await UserModel.findOneAndUpdate(
            { _id: userId },
            { 
                $pull: { gastos: { _id: deletedGasto._id } },
                $set: { totalAmountToSpend: newTotalAmount } 
            },
            { new: true }
        );

        return result;
      } catch (error) {
          console.log("Error: " + error);
          return null;
      }
    }

    async editSpentTransaction(gastoId: string, userId: string , newAmount: number){
      try {

        const user = await UserModel.findOne({ _id: userId });
        if (!user) {
            return null;
        }

        const editedGasto = user.gastos.find(gasto => gasto._id?.toString() === gastoId);
        if (!editedGasto) {
            return null;
        }

        

        if(editedGasto.amount) {
          if(newAmount > editedGasto.amount){
            user.totalAmountToSpend -=  (newAmount - editedGasto.amount)
          }else if(newAmount < editedGasto.amount){
            user.totalAmountToSpend +=  editedGasto.amount - newAmount  
          }
        }

        await user.save()

        const result: any = await UserModel.findOneAndUpdate(
          { _id: userId, "gastos._id": gastoId },
          { $set: { "gastos.$.amount": newAmount } },
          { new: true }
        );

        return result;

      } catch (error) {
        console.log("Error: " + error);
        return ;
      }
    }
    
}

export default UsersManager;
