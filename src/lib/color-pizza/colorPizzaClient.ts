import { AnyColour, HexColour, NamedColour2, RGBColour } from "../colour/colours";
import { IRequestOptions, IRestResponse, RestClient } from "typed-rest-client";
import { toHex } from "../colour/colourConversions";

const client: RestClient = new RestClient('prismatic', 'https://api.color.pizza/v1/')

interface LookupNamedColourResponse {
    paletteTitle: string,
    colors: LookupNamedColourResponseItem[]
}

interface LookupNamedColourResponseItem {
    name: string
    rgb: RGBColour
}

export async function lookupColourName(colour: AnyColour): Promise<NamedColour2 | undefined> {
    const hex: string = toHex(colour).slice(1,7)
    const options: IRequestOptions = {
        queryParameters: {
            params: {
                values: hex,
            },
        },
    }
    const response: IRestResponse<LookupNamedColourResponse> = await client.get('', options)
    const item: LookupNamedColourResponseItem | undefined = response.result?.colors[0]
    if (item === undefined) return undefined
    console.log(item.rgb)
    const newHex = toHex(item.rgb)
    console.log(newHex)
    return {
        name: item.name,
        hex: toHex(item.rgb),
    }
}
