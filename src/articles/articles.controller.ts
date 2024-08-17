import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, ParseIntPipe } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import {  ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ArticleEntity } from './entities/article.entity';
import { PrismaService } from 'src/prisma/prisma.service';

//https://wanago.io/2023/12/04/api-nestjs-raw-sql-prisma-postgresql-range-types/

@Controller('articles')
@ApiTags('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService, private prisma: PrismaService) {}

  @Post()
  //@ApiCreatedResponse({type: ArticleEntity})
  async create(@Body() createArticleDto: CreateArticleDto) {
    // console.log(`INSERT INTO public."Article" (title,description,body,published) 
    //                  VALUES('${createArticleDto.title}','${createArticleDto.description}','${createArticleDto.body}',${createArticleDto.published}) `);
    //return new ArticleEntity(await this.articlesService.create(createArticleDto));
     //const result = await this.prisma.$queryRaw`INSERT INTO public."Article" (title,description,body,published,authorId) VALUES(${createArticleDto}) RETURNING *`;
     const result = await this.prisma.$executeRawUnsafe(`INSERT INTO public."Article" (title,description,body,published) 
                     VALUES('${createArticleDto.title}','${createArticleDto.description}','${createArticleDto.body}',${createArticleDto.published});`);
    // const result = await this.prisma.$executeRawUnsafe(`INSERT INTO public."Article" (title,description,body,published) 
    //                  VALUES($1,$2,$3,$4)
    //                     RETURNING *`
    //                     ,
                        
    //                       [createArticleDto.title,
    //                       createArticleDto.description,
    //                       createArticleDto.body,
    //                       createArticleDto.published],
    //                       );
                        
     return result;

  }

  @Get()
  //@ApiOkResponse({type: ArticleEntity, isArray: true})
  findAll() {
    // const result = await this.prisma.$queryRaw`SELECT * FROM public."Article"`;
    // return result;
    
    return this.articlesService.findAll();
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

  @Get(':title')
  @ApiOkResponse({type: ArticleEntity})
  async findOne(@Param('title') title: string) {
    const article = await this.articlesService.findOne(title);
    if(!article)
    {
      //throw new NotFoundException('Article with ${id} does not exist.');
      throw new NotFoundException(`Article with ${title} does not exist.`);
    }
    //return new ArticleEntity(article);
    return article;


      // const article = await this.prisma.$queryRaw`SELECT * FROM "Article" where id=${id}`;
      // if(article == '')
      // {
      //   //throw new NotFoundException('Article with ${id} does not exist.');
      //   throw new NotFoundException(`Article with ${id} does not exist.`);
      // }
      // //return new ArticleEntity(article);
      // return article;
      // //return this.articlesService.findOne(id);
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
    const result = await this.articlesService.update(id, updateArticleDto);

    return result;
    // return new ArticleEntity(
    // await this.articlesService.update(id, updateArticleDto));
  }

  @Delete(':id')
  @ApiOkResponse({type: ArticleEntity})
  async remove(@Param('id', ParseIntPipe) id: number) {
    return new ArticleEntity(await this.articlesService.remove(id));
  }
}
