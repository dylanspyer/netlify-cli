import { join } from 'path'
import process from 'process'

import { describe, expect, test } from 'vitest'

import { isFileAsync } from '../../../../src/lib/fs.js'
import { callCli } from '../../utils/call-cli.js'
import { getCLIOptions, withMockApi } from '../../utils/mock-api.js'
import { withSiteBuilder, withTwoSiteBuilders } from '../../utils/site-builder.ts'

describe('link command', () => {
  test('should create gitignore in repository root when is root TEST', async (t) => {
    await withSiteBuilder(t, async (builder) => {
      await builder.withGit().build()

      await withMockApi(
        [],
        async ({ apiUrl }) => {
          await callCli(['link'], getCLIOptions({ builder, apiUrl }))

          expect(await isFileAsync(join(builder.directory, '.gitignore'))).toBe(true)
        },
        true,
      )
    })
  })



  test.skipIf(process.platform === 'win32')(
    'should create gitignore in repository root when cwd is subdirectory',
    async (t) => {


      await withSiteBuilder(t, async (builder) => {
        const projectPath = join('projects', 'project1')
        // await builder.withGit().withNetlifyToml({ config: {}, pathPrefix: projectPath })
        await builder.withGit().withNetlifyToml({ config: {}, pathPrefix: projectPath }).withEnvFile({ env: {SITE_ONE_NAME: 'site_one', SITE_TWO_NAME: 'site_two'}}).build()
        await withMockApi(
          [],
          async ({ apiUrl }) => {
            const options = getCLIOptions({ builder, apiUrl, env: {name: 'site'}}, )

            // await callCli(['unlink'], { ...options, cwd: join(builder.directory, projectPath) })
            const stdout = await callCli(['link'], { ...options, cwd: join(builder.directory, projectPath) })

            console.log(stdout)
            // await callCli(['link', {}])

            // ntl link --name site2

            expect(await isFileAsync(join(builder.directory, '.gitignore'))).toBe(true)
          },
          true,
        )
      })
    },
  )

})

  // test('should prefer exact matching site name if exists', async (t) => {
  //   console.log(t.task.name)
  //   await withTwoSiteBuilders(t, async (builder1, builder2) => {
  //     console.log(builder1)
  //     console.log(builder2)

  //     const projectPath = join('projects', 'project1')
  //     await builder1.withEnvFile().withNetlifyToml({ config: {}, pathPrefix: projectPath }).build()

  //     await withMockApi(
  //       [],
  //       async ({ apiUrl }) => {
  //         const options = getCLIOptions({ builder1, apiUrl })
  //         const stdout = await callCli(['link'], { ...options, cwd: join(builder1.directory, projectPath) })
  //         console.log(stdout)

  //       },
  //       true,
  //     )


      
  //     // expect(builder
  //   })
    // await withSiteBuilder('siteName', async (builder) => {
    //   await withMockApi(
    //     [],
    //     async ({ apiUrl }) => {
    //       await callCli(['link'], getCLIOptions({ builder, apiUrl }))

    //       expect(true)
    //     },
    //     true,
    //   )
    // })
  // })

  
