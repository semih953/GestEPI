import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import { EPI, EPIType, EPICategory } from 'gestepiinterfaces-semih';

interface EPICreationAttributes extends Optional<EPI, 'id'> {}

class EPIModel extends Model<EPI, EPICreationAttributes> implements EPI {
  public id!: number;
  public customId!: string;
  public type!: EPIType;
  public category!: EPICategory;
  public brand!: string;
  public model!: string;
  public serialNumber!: string;
  public purchaseDate!: Date;
  public manufacturingDate!: Date;
  public commissioningDate!: Date;
  public size?: string;
  public color?: string;
  public controlFrequency!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

EPIModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    customId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    type: {
      type: DataTypes.ENUM(...Object.values(EPIType)),
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM(...Object.values(EPICategory)),
      allowNull: false,
    },
    brand: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    model: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    serialNumber: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    purchaseDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    manufacturingDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    commissioningDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    size: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    color: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    controlFrequency: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'epis',
  }
);

export default EPIModel;