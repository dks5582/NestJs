import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService){}

  create(createArticleDto: CreateArticleDto) {
    //return 'This action adds a new article';
    return this.prisma.article.create({data: createArticleDto});
  }

  findAll() {
    //return `This action returns all articles`;
    return this.prisma.$queryRaw`SELECT * FROM public."Article"`;
    //const result = await this.prisma.$queryRaw`SELECT * FROM Article`;
    
    //return result;
    // return this.prisma.article.findMany({
    //   where: {published: true},
    //   include: {
    //     author: true,
    //   },
    // });
  }

  finddrafts(){
    return this.prisma.article.findMany({
      where: { published: false },
      include: {
        author: true,
      },
    });
  }

  async findOne(title: string) {
    //return `This action returns a #${id} article`;
    const result = await this.prisma.$queryRaw`SELECT * FROM public."Article" where title=${title}`;
    
    return result;
    // return this.prisma.article.findUnique({
    //   where: { id },
    //   include: {
    //     author: true,
    //   },
    // });
  }


  async update(id: number, updateArticleDto: UpdateArticleDto) {
    //return `This action updates a #${id} article`;
    // const qry = this.prisma.article.fields.  `update public."Article" set ${updateArticleDto} where id=${id}`;
    // console.log(qry);
    const result = await this.prisma.$executeRawUnsafe(`update public."Article" set ${updateArticleDto} where id=${id}`);

    return result;
  }
  // update(id: number, updateArticleDto: UpdateArticleDto) {
  //   //return `This action updates a #${id} article`;
  //   return this.prisma.article.update({where: { id }, data: updateArticleDto,});
  // }

  remove(id: number) {
    //return `This action removes a #${id} article`;
    return this.prisma.article.delete({where: { id }});
  }
}
