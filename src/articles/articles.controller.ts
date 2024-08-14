import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, ParseIntPipe } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ArticleEntity } from './entities/article.entity';
import { PrismaService } from 'src/prisma/prisma.service';

//https://wanago.io/2023/12/04/api-nestjs-raw-sql-prisma-postgresql-range-types/

@Controller('articles')
@ApiTags('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService, private prisma: PrismaService) {}

  @Post()
  @ApiCreatedResponse({type: ArticleEntity})
  async create(@Body() createArticleDto: CreateArticleDto) {
    return new ArticleEntity(await this.articlesService.create(createArticleDto));
  }

  @Get()
  //@ApiOkResponse({type: ArticleEntity, isArray: true})
  async findAll() {
    const result = await this.prisma.$queryRaw`SELECT * FROM public."Article"`;
    return result;
    
    //return this.articlesService.findAll();
  }
  // async findAll() {
  //   const articles = await this.articlesService.findAll();
  //   return articles.map((article) => new ArticleEntity(article));
  //   //return this.articlesService.findAll();
  // }

  @Get('drafts')
  @ApiOkResponse({type: ArticleEntity, isArray: true})
  async finddrafts(){
    const drafts = await this.articlesService.finddrafts();
    return drafts.map((draft) => new ArticleEntity(draft));
    //return this.articlesService.finddrafts();
  }

  @Get(':id')
  @ApiOkResponse({type: ArticleEntity})
  async findOne(@Param('id', ParseIntPipe) id: number) {
      const article = await this.prisma.$queryRaw`SELECT * FROM "Article" where id=${id}`;
      if(article == '')
      {
        //throw new NotFoundException('Article with ${id} does not exist.');
        throw new NotFoundException(`Article with ${id} does not exist.`);
      }
      //return new ArticleEntity(article);
      return article;
      //return this.articlesService.findOne(id);
    }

  // async findOne(@Param('id', ParseIntPipe) id: number) {
  //   const article = await this.articlesService.findOne(id);
  //   if(!article)
  //   {
  //     //throw new NotFoundException('Article with ${id} does not exist.');
  //     throw new NotFoundException(`Article with ${id} does not exist.`);
  //   }
  //   return new ArticleEntity(article);
  //   //return article
  //   //return this.articlesService.findOne(id);
  // }

  @Patch(':id')
  @ApiOkResponse({type: ArticleEntity})
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateArticleDto: UpdateArticleDto
  ) {
    return new ArticleEntity(
    await this.articlesService.update(id, updateArticleDto));
  }

  @Delete(':id')
  @ApiOkResponse({type: ArticleEntity})
  async remove(@Param('id', ParseIntPipe) id: number) {
    return new ArticleEntity(await this.articlesService.remove(id));
  }
}
