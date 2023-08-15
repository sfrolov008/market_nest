import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { CarGen, CarMake, CarModel } from './entities/car.model';
import { GenDto, MakeDto, ModelDto } from './dtos/car.dto';

@Injectable()
export class CarService {
  constructor(
    @InjectModel(CarMake) private makeModel: typeof CarMake,
    @InjectModel(CarModel) private modelModel: typeof CarModel,
    @InjectModel(CarGen) private genModel: typeof CarGen,
  ) {}

  async createMake(makeData: MakeDto): Promise<CarMake> {
    try {
      return this.makeModel.create(makeData);
    } catch (error) {
      throw new HttpException(
        'Failed to create Make',
        HttpStatus.BAD_REQUEST,
        error,
      );
    }
  }

  async getAllMakes(): Promise<CarMake[]> {
    try {
      return this.makeModel.findAll();
    } catch (error) {
      throw new HttpException(
        'Failed to fetch Makes',
        HttpStatus.BAD_REQUEST,
        error,
      );
    }
  }

  async getOneMake(makeId: string): Promise<CarMake> {
    try {
      return this.makeModel.findOne({ where: { id: makeId } });
    } catch (error) {
      if (NotFoundException) {
        throw new NotFoundException(`Make with ${makeId} not found`);
      }
      throw new HttpException('Failed to fetch make', HttpStatus.BAD_REQUEST);
    }
  }

  async updateMake(makeId: string, updateMakeData: MakeDto): Promise<CarMake> {
    const [updatedRowsCount, [updatedMake]] = await this.makeModel.update(
      updateMakeData,
      {
        where: { id: makeId },
        returning: true,
      },
    );
    if (updatedRowsCount === 0) {
      throw new NotFoundException(`Make with ${makeId} not found`);
    }
    return updatedMake;
  }

  async removeMake(makeId: string) {
    const deletedRowsCount = await this.makeModel.destroy({
      where: { id: makeId },
    });
    if (deletedRowsCount === 0) {
      throw new NotFoundException(`Make with ${makeId} not found`);
    }
  }

  async createModel(modelData: ModelDto): Promise<CarModel> {
    try {
      return this.modelModel.create(modelData);
    } catch (error) {
      throw new HttpException(
        'Failed to create carModel',
        HttpStatus.BAD_REQUEST,
        error,
      );
    }
  }

  async getAllModels(makeId: string): Promise<CarModel[]> {
    try {
      return this.modelModel.findAll({ where: { makeId } });
    } catch (error) {
      throw new HttpException(
        'Failed to fetch models',
        HttpStatus.BAD_REQUEST,
        error,
      );
    }
  }

  async getOneModel(modelId: string): Promise<CarModel> {
    try {
      return this.modelModel.findOne({ where: { id: modelId } });
    } catch (error) {
      if (NotFoundException) {
        throw new NotFoundException(`Model with ${modelId} not found`);
      }
      throw new HttpException('Failed to fetch model', HttpStatus.BAD_REQUEST);
    }
  }

  async updateModel(
    modelId: string,
    updateModelData: ModelDto,
  ): Promise<CarModel> {
    const [updatedRowsCount, [updatedModel]] = await this.modelModel.update(
      updateModelData,
      {
        where: { id: modelId },
        returning: true,
      },
    );
    if (updatedRowsCount === 0) {
      throw new NotFoundException(`Model with ${modelId} not found`);
    }
    return updatedModel;
  }

  async removeModel(modelId: string) {
    const deletedRowsCount = await this.modelModel.destroy({
      where: { id: modelId },
    });
    if (deletedRowsCount === 0) {
      throw new NotFoundException(`Model with ${modelId} not found`);
    }
  }

  async createGen(genData: GenDto): Promise<CarGen> {
    try {
      return this.genModel.create(genData);
    } catch (error) {
      throw new HttpException(
        'Failed to create generation',
        HttpStatus.BAD_REQUEST,
        error,
      );
    }
  }

  async getAllGens(modelId: string): Promise<CarGen[]> {
    try {
      return this.genModel.findAll({ where: { modelId } });
    } catch (error) {
      throw new HttpException(
        'Failed to fetch generations',
        HttpStatus.BAD_REQUEST,
        error,
      );
    }
  }

  async getOneGen(genId: string): Promise<CarGen> {
    try {
      return this.genModel.findOne({ where: { id: genId } });
    } catch (error) {
      if (NotFoundException) {
        throw new NotFoundException(`Generation with ${genId} not found`);
      }
      throw new HttpException(
        'Failed to fetch generation',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateGen(genId: string, updateGenData: GenDto): Promise<CarGen> {
    const [updatedRowsCount, [updatedGen]] = await this.genModel.update(
      updateGenData,
      {
        where: { id: genId },
        returning: true,
      },
    );
    if (updatedRowsCount === 0) {
      throw new NotFoundException(`Gen with ${genId} not found`);
    }
    return updatedGen;
  }

  async removeGen(genId: string) {
    const deletedRowsCount = await this.genModel.destroy({
      where: { id: genId },
    });
    if (deletedRowsCount === 0) {
      throw new NotFoundException(`Generation with ${genId} not found`);
    }
  }
}
