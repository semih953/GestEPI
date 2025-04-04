import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import { Control, ControlStatus } from 'gestepiinterfaces-semih';
import EPIModel from './epi.model';

interface ControlCreationAttributes extends Optional<Control, 'id'> {}

class ControlModel extends Model<Control, ControlCreationAttributes> implements Control {
  public id!: number;
  public epiId!: number;
  public controlDate!: Date;
  public manager!: string;
  public status!: ControlStatus;
  public remarks?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ControlModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    epiId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: EPIModel,
        key: 'id',
      },
    },
    controlDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    manager: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(ControlStatus)),
      allowNull: false,
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'controls',
  }
);

// Définition des associations
EPIModel.hasMany(ControlModel, {
  sourceKey: 'id',
  foreignKey: 'epiId',
  as: 'controls',
});

ControlModel.belongsTo(EPIModel, {
  foreignKey: 'epiId',
  as: 'epi',
});

export default ControlModel;